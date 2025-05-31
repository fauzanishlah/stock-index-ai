import { useState } from 'react';
import { openDB, DBSchema } from 'idb';
import { ChatSession , ChatMessage} from '@/types/chat';
import { chatAPI } from '@/api/chat_v2';
// export default useChatData;
import { useContext } from "react";
import {ChatContext} from "@/context/ChatContext";

interface ChatDBSchema extends DBSchema {
  chatSessions: {
    key: string;
    value: ChatSession;
    indexes: { 'by-updated': 'updated_at' };
  };
  chatMessages: {
    key: string;
    value: {
      session_id: string;
      messages: ChatMessage[];
    };
  };
}

const dbPromise = openDB<ChatDBSchema>('chat-db', 1, {
  upgrade(db) {
    const sessionStore = db.createObjectStore('chatSessions', { keyPath: 'id' });
    sessionStore.createIndex('by-updated', 'updated_at');
    db.createObjectStore('chatMessages', { keyPath: 'session_id' });
  },
  blocked() {
    console.log('Database is blocked');
  },
  blocking() {
    console.log('Database is blocking');
  },
  terminated() {
    console.log('Database is terminated');
  },
})

const useChatData1 = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({});
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [errorSessions, setErrorSessions] = useState<Error | null>(null);
  const [errorMessages, setErrorMessages] = useState<Error | null>(null);

  // Helper to sort sessions by updated_at descending
  const sortSessions = (sessions: ChatSession[]) => 
    sessions.sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );

  const fetchChatSessions = async () => {
    setLoadingSessions(true);
    setErrorSessions(null);

    try {
      const db = await dbPromise;
      
      // Try cache first with sorted results
      const cached = await db.getAllFromIndex('chatSessions', 'by-updated');
      setChatSessions(sortSessions(cached));

      // Network request
      if (cached.length === 0) {
        const response = await chatAPI.getSessions();
        const sessions = response.chat_sessions;
        console.log(sessions)
        const tx = db.transaction('chatSessions', 'readwrite');
        sessions.map(session => tx.store.add(session));
        await tx.done;
        setChatSessions(sortSessions(sessions));
      }

    } catch (err) {
      console.log(err);
      setErrorSessions(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoadingSessions(false);
    }
  };

  const fetchChatMessages = async (sessionId: string) => {
    setLoadingMessages(true);
    setErrorMessages(null);

    try {
      const db = await dbPromise;

      // Try cache first
      const cached = await db.get('chatMessages', sessionId);
      if (cached) {
        setChatMessages(prev => ({
          ...prev,
          [sessionId]: cached.messages,
        }));
      }

      // Network request
      const response = await fetch(`http://localhost:8000/api/chat/s/${sessionId}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const messages = await response.json();

      // Update cache
      const tx = db.transaction('chatMessages', 'readwrite');
      await tx.store.put({
        session_id: sessionId,
        messages,
      });
      await tx.done;

      setChatMessages(prev => ({
        ...prev,
        [sessionId]: messages,
      }));
    } catch (err) {
      setErrorMessages(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoadingMessages(false);
    }
  };

  const addChatSession = async (newSession: Omit<ChatSession, 'created_at' | 'updated_at'>) => {
    try {
      const db = await dbPromise;
      
      const sessionToAdd: ChatSession = {
        ...newSession,
        created_at: new Date(),
        updated_at: new Date(),
      };

      await db.add('chatSessions', sessionToAdd);
      
      // Get updated sorted sessions
      const sessions = await db.getAllFromIndex('chatSessions', 'by-updated');
      setChatSessions(sortSessions(sessions));
      console.log("add session", sessions)
      return sessionToAdd;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create session');
    }
  };

  const loadFromCache = async () => {
    const db = await dbPromise;
    const sessions = await db.getAllFromIndex('chatSessions', 'by-updated');
    const messages = await db.getAll('chatMessages');
    
    setChatSessions(sortSessions(sessions));
    setChatMessages(messages.reduce((acc, curr) => ({
      ...acc,
      [curr.session_id]: curr.messages
    }), {}));
  };

  const updateChatSession = async (sessionId: string, updates: Partial<Pick<ChatSession, 'title'>>) => {
    try {
      const db = await dbPromise;
      const session = await db.get('chatSessions', sessionId);
      if (!session) throw new Error('Session not found');

      const updatedSession = {
        ...session,
        ...updates,
        updated_at: new Date().toISOString(),
      };

      // API call
      const response = await fetch(`http://localhost:8000/api/chat/s/${sessionId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSession),
      });
      
      if (!response.ok) throw new Error('Failed to update session');
      const serverUpdatedSession = await response.json();

      // Update IndexedDB with server response
      await db.put('chatSessions', serverUpdatedSession);

      // Get updated sorted sessions
      const sessions = await db.getAllFromIndex('chatSessions', 'by-updated');
      setChatSessions(sortSessions(sessions));

      return serverUpdatedSession;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update session');
    }
  };

  const deleteChatSession = async (sessionId: string) => {
    try {
      // API call
      const response = await fetch(`http://localhost:8000/api/chat/${sessionId}/`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete session');

      // Update IndexedDB
      const db = await dbPromise;
      await db.delete('chatSessions', sessionId);
      await db.delete('chatMessages', sessionId);

      // Get updated sorted sessions
      const sessions = await db.getAllFromIndex('chatSessions', 'by-updated');
      setChatSessions(sortSessions(sessions));

      // Update messages state
      setChatMessages(prev => {
        const newMessages = { ...prev };
        delete newMessages[sessionId];
        return newMessages;
      });
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete session');
    }
  };

  const clearChat = async() => {
    const db = await dbPromise;
    await db.clear('chatSessions');
    setChatSessions([]);
    await db.clear('chatMessages');
    setChatMessages({});
    
  }

  return {
    chatSessions,
    chatMessages,
    fetchChatSessions,
    fetchChatMessages,
    addChatSession,
    loadFromCache,
    updateChatSession,
    deleteChatSession,
    clearChat,
    loadingSessions,
    loadingMessages,
    errorSessions,
    errorMessages,
  };
};


const useChatData = () => {
  const context = useContext(ChatContext);
    if (!context) {
      throw new Error('useChatData must be used within an ChatProvider');
    }
    return context;
};

export default useChatData;