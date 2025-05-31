import { cn } from "@/lib/utils";
import ChatLoadingCircle from "./ChatLoadingCircle";
import { RiRobot2Line } from "react-icons/ri";

const SkeletonGeneratingChat = () => {
  return (
    <div className="relative w-full mt-2">
      <div className="size-7 absolute right-full mr-1 mt-2">
        <div className="relative block size-full">
          <RiRobot2Line className="absolute size-full top-1/2 left-1/2 -translate-1/2" />
          <ChatLoadingCircle className="absolute top-1/2 left-1/2 -translate-1/2 w-[calc(100%_+_1rem)] h-[calc(100%_+_1rem)]" />
        </div>
      </div>
      <div className="h-fit w-full flex px-4 py-1 text-wrap text-left">
        <span
          className={cn(
            "bg-[length:200%_auto]",
            "bg-gradient-to-r from-blue-600/70 via-gray-500/50 to-blue-600/70 bg-clip-text text-transparent",
            "animate-flows"
          )}
        >
          AI Thinking...
        </span>
      </div>
    </div>
  );
};

export default SkeletonGeneratingChat;
