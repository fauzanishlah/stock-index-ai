import { useNavigate } from "react-router-dom";
import ChatInput from "../ChatInput";
import { v7 as uuid } from "uuid";
import { useEffect } from "react";
import useChatData from "@/hooks/useChatData";
import { ChatSession } from "@/types/chat";
import { useAuth } from "@/hooks/useAuth";
import { showToast } from "@/lib/toast";

export const HomePage = () => {
  const navigate = useNavigate();
  // const { currentSession, initChat } = useChat();
  const { addChatSession, setCurrentSession, currentChatSession } =
    useChatData();
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Home";
  });

  useEffect(() => {
    setCurrentSession("");
  }, [currentChatSession?.id]);

  const handleSubmitForm = async (e: React.FormEvent) => {
    console.log("form submitted from home");
    const tempSessionId = uuid();
    console.log("init session", tempSessionId);
    const input = (e.target as HTMLInputElement).value;
    if (!user) {
      console.error("User is not authenticated.");
      showToast.warning("User is not authenticated.");
      return;
    }

    const chatSession: ChatSession = {
      id: tempSessionId,
      user_id: user.id,
      title: input,
      created_at: new Date(),
      updated_at: new Date(),
    };
    await addChatSession(chatSession);
    navigate(`/chat/${tempSessionId}`, {
      state: { initialInput: input },
    });
  };

  console.log("home current chat session", currentChatSession);

  return (
    <main className="bg-neutral-50/20 relative w-full min-h-screen flex-col items-center justify-between">
      <div className="absolute flex flex-col items-center w-full p-4 top-1/2 transform -translate-y-1/2">
        <header className="m-5 text-3xl font-semibold">
          How can I help you?
        </header>
        {/* Add your home page content here */}
        <ChatInput
          className="w-9/10 p-2 max-w-4xl"
          onSubmit={handleSubmitForm}
        />
      </div>
      {/* <div className="h-100 w-100 overflow-auto">{loremlol}</div> */}
    </main>
  );
};
