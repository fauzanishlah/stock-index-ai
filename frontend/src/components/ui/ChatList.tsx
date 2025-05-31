import { ChatListItem } from "./ChatListItem";
import { ChatSession } from "@/types/chat";

interface ChatListProps {
  sessions: ChatSession[];
  activeChatId?: string;
  isOpen: boolean;
}

export const ChatList = ({ sessions, activeChatId, isOpen }: ChatListProps) => (
  <div className="flex-1 overflow-y-auto w-full">
    {sessions.map((session) => (
      <ChatListItem
        key={session.id}
        session={session}
        isActive={session.id === activeChatId}
        isOpen={isOpen}
      />
    ))}
  </div>
);
