import { cn } from "@/lib/utils";
import { FiPlus } from "react-icons/fi";

interface NewChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export const NewChatButton = ({ onClick, isOpen }: NewChatButtonProps) => (
  <button
    onClick={onClick}
    className={cn(
      "shadow-md/30 bg-white rounded-full flex self-center items-center gap-2 p-2 my-3 hover:bg-blue-500 hover:text-white transition-transform ease-in-out duration-300",
      isOpen ? "w-9/10" : "w-fit"
    )}
  >
    <FiPlus className="w-6 h-6" />
    {isOpen && <span className="text-base">New Chat</span>}
  </button>
);
