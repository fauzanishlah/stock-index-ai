import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { MdOutlineChatBubbleOutline } from "react-icons/md";

// import { Link } from "react-router-dom";

interface ChatListItemProps {
  session: {
    id: string;
    title: string;
  };
  isActive: boolean;
  isOpen: boolean;
}

export const ChatListItem = ({
  session,
  isActive,
  isOpen,
}: ChatListItemProps) => (
  <Link
    to={`/chat/${session.id}`}
    className={cn(
      "mx-2 my-1 rounded-lg flex items-center hover:bg-blue-500/10 transition-colors overflow-hidden",
      isActive && "border-blue-500 border-1 text-blue-500"
    )}
  >
    {isOpen && (
      <div className="ml-1 w-full py-1 flex items-center h-full gap-1">
        <MdOutlineChatBubbleOutline />
        <span className="text-lg truncate">{session.title}</span>
      </div>
    )}
  </Link>
);
