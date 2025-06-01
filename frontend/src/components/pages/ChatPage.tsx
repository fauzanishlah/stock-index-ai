"use client";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import ChatInput from "../ChatInput";
import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "@/types/chat";
import { sendToAgent } from "@/api/chat_v2";
import { v7 as uuid } from "uuid";
import { ChatBubble } from "../ui/ChatBubble";
import { useAuth } from "@/hooks/useAuth";
import { showToast } from "@/lib/toast";
import useChatData from "@/hooks/useChatData";
import SkeletonGeneratingChat from "../ui/SkeletonGeneratingChat";
import "react-loading-skeleton/dist/skeleton.css";

export const ChatPage = () => {
  const { chatId: sessionId } = useParams<{ chatId: string }>();
  const { user } = useAuth();
  const {
    chatMessages,
    currentChatSession,
    setCurrentSession,
    addChatMessage,
  } = useChatData();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const abortController = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [isProcessedInitialInput, setIsProcessedInitialInput] = useState(false);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const addMessage = (message: ChatMessage) => {
    addChatMessage(message);
    console.log("add chatMessages", chatMessages);
    scrollToBottom();
  };

  useEffect(() => {
    if (abortController.current) {
      abortController.current.abort();
    }
    if (!user?.id) {
      navigate("/");
    }
    return () => {};
  }, []);

  useEffect(() => {
    if (sessionId) {
      setCurrentSession(sessionId);
    }
  }, [sessionId]);

  useEffect(() => {
    const processInitialInput = async () => {
      if (location.state?.initialInput && !isProcessedInitialInput) {
        await handleSendMessage(location.state.initialInput as string);
        setIsProcessedInitialInput(true);
      }
    };
    processInitialInput();
  }, [location.state?.initialInput, isProcessedInitialInput]);

  const handleOnMessage = (event: string, data: Record<string, any>) => {
    if (event === "updates") {
      const newMessage: ChatMessage = {
        id: data.id,
        session_id: data.session_id || "",
        message_id: data.message_id,
        role: data.role,
        content: data.content,
        created_at: new Date(),
      };
      addMessage(newMessage);
    }
  };

  const handleOnClose = () => {
    // generatedChatMessages.map((message) => {
    //   console.log("add message from generated message", message);
    //   addMessage(message);
    // });
    // setGeneratedChatMessage([]);
  };

  const handleSendMessage = async (messageContent: string) => {
    if (abortController.current) {
      abortController.current.abort();
    }
    const newMessage: ChatMessage = {
      id: uuid(),
      session_id: sessionId || "",
      message_id: uuid(),
      role: "human",
      content: messageContent,
      created_at: new Date(),
    };
    addMessage(newMessage);
    setIsGenerating(true);
    try {
      abortController.current = await sendToAgent(
        sessionId || "",
        messageContent,
        handleOnMessage,
        undefined,
        handleOnClose
      );
    } catch (error) {
      console.error("Request failed:", error);
      showToast.error("Request failed. Please try again later.");
      setIsGenerating(false);
      return;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating) return;
    try {
      const input = (e.target as HTMLInputElement).value;
      console.log("form submitted from chat page", input);
      if (!input.trim()) return;
      await handleSendMessage(input.trim());
    } catch (error) {
      console.error("Error handling submit:", error);
      return;
    }
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="shadow-xl grow-0 shrink-0">
        <div className="h-20 text-center flex items-center justify-center">
          <p className="text-xl">{currentChatSession?.title}</p>
        </div>
      </div>

      <div className="relative grow-1">
        <div className="absolute overflow-auto p-0 bottom-0 top-0 left-0 right-0 min-h-full">
          <div className="relative flex flex-col h-full">
            <div className="grow-1 m-auto w-full pb-6 mt-4 flex flex-col items-center">
              <div className="relative background-transparent w-250 max-w-19/20">
                {chatMessages.map((message, i, arr) => {
                  if (message.session_id !== sessionId) return null;
                  const isFirstAI: boolean =
                    message.role !== "human" && arr[i - 1]?.role === "human";

                  if (
                    message.role === "human" &&
                    isGenerating &&
                    i === arr.length - 1
                  ) {
                    return (
                      <div className="">
                        <ChatBubble
                          content={message.content}
                          role={message.role}
                          key={message.message_id}
                          createdAt={message.created_at}
                          isGenerating={isGenerating}
                          isShowAIIcon={isFirstAI}
                        />
                        <SkeletonGeneratingChat key={message.message_id} />
                      </div>
                    );
                  }

                  return (
                    <div
                      ref={i === arr.length - 1 ? messagesEndRef : null}
                      key={message.message_id}
                    >
                      <ChatBubble
                        content={message.content}
                        role={message.role}
                        key={message.message_id}
                        createdAt={message.created_at}
                        isGenerating={isGenerating}
                        isShowAIIcon={isFirstAI}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className=" sticky bottom-0 flex flex-col mt-auto items-center justify-items-center bg-white pt-2 pb-4">
              <div className="relative grow-1 w-full max-w-4xl">
                <ChatInput className="mx-4" onSubmit={handleSubmit} />
              </div>
              <div className="">AI-generated, for reference only</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
