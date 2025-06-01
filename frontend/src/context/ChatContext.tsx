import { ChatSession, ChatMessage } from "@/types/chat";
import { createContext, ReactNode } from "react";
import { useState } from "react";
import { openDB, DBSchema } from "idb";
import { chatAPI } from "@/api/chat_v2";
import { useAuth } from "@/hooks/useAuth";

interface ChatDBSchema extends DBSchema {
  chatSessions: {
    key: string;
    value: ChatSession;
    indexes: { "by-updated": "updated_at" };
  };

  chatMessages: {
    key: string;
    value: {
      session_id: string;
      messages: ChatMessage[];
    };
  };
}

const dbPromise = openDB<ChatDBSchema>("chat-db", 1, {
  upgrade(db) {
    const sessionStore = db.createObjectStore("chatSessions", {
      keyPath: "id",
    });
    sessionStore.createIndex("by-updated", "updated_at");
    db.createObjectStore("chatMessages", { keyPath: "session_id" });
  },
  blocked() {
    console.log("Database is blocked");
  },
  blocking() {
    console.log("Database is blocking");
  },
  terminated() {
    console.log("Database is terminated");
  },
});

type ChatContextType = {
  chatSessions: ChatSession[];
  chatMessages: ChatMessage[];
  currentChatSession: ChatSession | undefined;
  isChatGenerating: boolean;
  loadingSessions: boolean;
  loadingMessages: boolean;
  errorSessions: Error | null;
  errorMessages: Error | null;
  fetchChatSessions: () => Promise<void>;
  fetchChatMessages: (sessionId: string) => Promise<void>;
  addChatSession: (session: ChatSession) => Promise<ChatSession | undefined>;
  addChatMessage: (message: ChatMessage) => Promise<void>;
  setChatSessions: React.Dispatch<React.SetStateAction<ChatSession[]>>;
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setCurrentSession: (sessionId: string) => void;
  setIsChatGenerating: (isGenerating: boolean) => void;
  setSessionTitle: (sessionId: string, title: string) => Promise<void>;
  clearChat: () => void;
};
const ChatContext = createContext<ChatContextType>({} as ChatContextType);

const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatSession, setCurrentChatSession] = useState<ChatSession>();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatGenerating, setIsChatGenerating] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [errorSessions, setErrorSessions] = useState<Error | null>(null);
  const [errorMessages, setErrorMessages] = useState<Error | null>(null);
  const { user } = useAuth();
  const sortSessions = (sessions: ChatSession[]) =>
    sessions.sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );

  const fetchChatSessions = async () => {
    console.log("Fetching chat sessions...", user);

    try {
      setLoadingSessions(true);
      const db = await dbPromise;
      const sessionsCached = await db.getAll("chatSessions");
      if (sessionsCached.length === 0) {
        const chatSessionsAPI = (await chatAPI.getSessions()).chat_sessions;
        if (chatSessionsAPI.length > 0) {
          chatSessionsAPI.map(async (session) => {
            db.add("chatSessions", session);
          });
          console.log(
            "Adding sessions to database, length: ",
            chatSessionsAPI.length
          );
          setChatSessions(sortSessions(chatSessionsAPI));
          setErrorSessions(null);
        }
      } else {
        setChatSessions(sortSessions(sessionsCached));
      }
    } catch (error) {
      setErrorSessions(error as Error);
    } finally {
      setLoadingSessions(false);
    }
  };

  const fetchChatMessages = async (sessionId: string) => {
    setLoadingMessages(true);
    try {
      const db = await dbPromise;
      const messagesCached = await db.get("chatMessages", sessionId);
      if (messagesCached) {
        setChatMessages(messagesCached.messages);
      } else {
        const chatMessagesAPI = await chatAPI.getMessages(sessionId);
        if (chatMessagesAPI.messages.length > 0) {
          const tx = db.transaction("chatMessages", "readwrite");
          const store = tx.objectStore("chatMessages");
          store.put({
            session_id: sessionId,
            messages: chatMessagesAPI.messages,
          });
          await tx.done;
          setChatMessages(chatMessagesAPI.messages);
          setErrorMessages(null);
        }
      }
    } catch (error) {
      setErrorMessages(error as Error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const addChatSession = async (
    newSession: Omit<ChatSession, "created_at" | "updated_at">
  ) => {
    try {
      const db = await dbPromise;
      const existingSession = await db.get("chatSessions", newSession.id);
      if (existingSession) {
        setErrorSessions(new Error("Session already exists"));
        return;
      }
      const sessionToAdd: ChatSession = {
        ...newSession,
        created_at: new Date(),
        updated_at: new Date(),
      };
      await db.add("chatSessions", sessionToAdd);
      setChatSessions((prevSessions) => [sessionToAdd, ...prevSessions]);
      return sessionToAdd;
    } catch (err) {
      if (err instanceof Error) {
        setErrorSessions(err);
        throw err;
      } else {
        setErrorSessions(new Error("Failed to add session"));
        throw new Error("Failed to add session");
      }
    }
  };

  const addChatMessage = async (message: ChatMessage) => {
    try {
      const db = await dbPromise;
      const tx = db.transaction("chatMessages", "readwrite");
      const store = tx.objectStore("chatMessages");
      const messagesCached = await store.get(message.session_id);
      if (messagesCached) {
        messagesCached.messages.push(message);
        await store.put(messagesCached);
      } else {
        await store.put({
          session_id: message.session_id,
          messages: [message],
        });
      }
      await tx.done;
      setChatMessages((prevMessages) => [...prevMessages, message]);
      console.log("Message added to database");
    } catch (error) {
      console.log(error);
      setErrorMessages(error as Error);
    }
  };

  const setCurrentSession = (sessionId: string) => {
    const session = chatSessions.find((session) => session.id === sessionId);
    if (session) {
      setCurrentChatSession(session);
      fetchChatMessages(sessionId);
    } else {
      console.log("Session not found");
      setCurrentChatSession(undefined);
      setChatMessages([]);
    }
  };

  const setSessionTitle = async (sessionId: string, title: string) => {
    setLoadingSessions(true);
    try {
      const db = await dbPromise;
      const session = await db.get("chatSessions", sessionId);
      if (session) {
        session.title = title;
        session.updated_at = new Date();
        await db.put("chatSessions", session);
        setChatSessions((prevSessions) =>
          prevSessions.map((s) => (s.id === sessionId ? session : s))
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingSessions(false);
    }
  };

  const clearChat = async () => {
    const db = await dbPromise;
    setCurrentChatSession(undefined);
    setChatMessages([]);
    await db.clear("chatMessages");
    await db.clear("chatSessions");
  };

  return (
    <ChatContext.Provider
      value={{
        chatSessions,
        chatMessages,
        currentChatSession,
        isChatGenerating,
        loadingSessions,
        loadingMessages,
        errorSessions,
        errorMessages,
        fetchChatSessions,
        fetchChatMessages,
        addChatSession,
        addChatMessage,
        setChatSessions,
        setChatMessages,
        setCurrentSession,
        setIsChatGenerating,
        setSessionTitle,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
export { ChatContext };
