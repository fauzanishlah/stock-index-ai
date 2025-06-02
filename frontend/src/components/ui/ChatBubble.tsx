import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { useState } from "react";

import { MarkdownComponents } from "../utils/markdown";
import Markdown from "react-markdown";
import { RiRobot2Line } from "react-icons/ri";
import { LiaToolsSolid } from "react-icons/lia";
import remarkGfm from "remark-gfm";
import DataDisplay from "./DataDisplay";
import ChatLoadingCircle from "./ChatLoadingCircle";

interface ChatBubbleProps {
  role: "human" | "ai" | "tool";
  content: string;
  createdAt: Date;
  additionalKwargs?: Record<string, any>;
  toolCall?: Record<string, any>[];
  isGenerating?: boolean;
  isShowAIIcon?: boolean;
}

interface AILogoProps {
  isShowAIIcon?: boolean;
  isGenerating?: boolean;
}

const HumanBubble = ({ content }: ChatBubbleProps) => {
  return (
    <div
      className={cn(
        "bg-blue-200 text-left h-full max-w-4/5 p-2 rounded-b-xl rounded-tl-xl"
      )}
    >
      <Markdown>{content}</Markdown>
    </div>
  );
};

const AIBubble = ({ content }: ChatBubbleProps) => {
  return (
    <div
      className={cn(
        "max-w-4/5 px-4 py-1 text-left gap-2",
        content.length === 0 && "hidden"
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={MarkdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
const ToolBubble = ({ content, additionalKwargs }: ChatBubbleProps) => {
  const [isShowDetails, setIsShowDetails] = useState(false);

  const handleToggleDetails = () => {
    setIsShowDetails(!isShowDetails);
  };

  const toolCallDetails = JSON.parse(content);

  return (
    <div
      className={cn(
        "flex flex-col p-1 rounded-xl border mx-4",
        toolCallDetails.status === "success"
          ? "border-blue-400"
          : "border-red-400"
      )}
    >
      <div
        onClick={handleToggleDetails}
        className={cn(
          "flex flex-row cursor-pointer items-center mx-1 gap-2",
          toolCallDetails.status === "success"
            ? "text-blue-400"
            : "text-red-400"
        )}
      >
        <LiaToolsSolid
          className={cn(
            "transition-all duration-600 ease-in-out -rotate-90",
            isShowDetails && "rotate-90"
          )}
        />
        <span>
          {additionalKwargs?.tool_name ? additionalKwargs.tool_name : "Tool"}
        </span>
      </div>
      {isShowDetails && (
        <div>
          <hr />
          <div>
            {/* <span>{toolCallDetails}</span> */}
            <DataDisplay
              data={
                toolCallDetails.data
                  ? toolCallDetails.data
                  : toolCallDetails.error
              }
            />
          </div>
        </div>
      )}
    </div>
    // <div className="max-w-3/5 relative flex flex-row gap-4 rounded-xl bg-gray-100 px-4 py-1 items-center">
    //   <div
    //     className={cn(
    //       "h-4 w-4 absolute left-1 top-1 transition-all duration-600 ease-in-out cursor-pointer",
    //       isShowDetails && "rotate-45"
    //     )}
    //     onClick={handleToggleDetails}
    //   >
    //     <LiaToolsSolid />
    //   </div>
    //   <div>tool</div>
    //   {isShowDetails && (
    //     <div className="flex flex-col">
    //       {Object.entries(toolCallDetails).map(([key, value]) =>
    //         key === "status" ? (
    //           <div key={key} className="text-sm text-gray-700">
    //             <span className="font-semibold">{key}:</span> {String(value)}
    //           </div>
    //         ) : (
    //           <div key={key} className="text-sm text-gray-700">
    //             <span className="font-semibold">{key}:</span>{" "}
    //             {typeof value === "object"
    //               ? JSON.stringify(value)
    //               : String(value)}
    //           </div>
    //         )
    //       )}
    //     </div>
    //   )}
    // </div>
  );
};

export const AILogo = ({ isShowAIIcon = false, isGenerating }: AILogoProps) => {
  return isShowAIIcon ? (
    <div className="relative size-full block">
      <RiRobot2Line className="absolute size-full top-1/2 left-1/2 -translate-1/2" />

      {isGenerating && (
        <ChatLoadingCircle className="absolute top-1/2 left-1/2 -translate-1/2 w-[calc(100%_+_1rem)] h-[calc(100%_+_1rem)]" />
      )}
    </div>
  ) : null;
};

export const ChatBubble = ({
  role,
  content,
  createdAt,
  additionalKwargs,
  isShowAIIcon,
  isGenerating,
}: ChatBubbleProps) => {
  return (
    <>
      <div className="relative w-full mt-2">
        <div className="flex flex-row w-full">
          <div className="size-7 absolute right-full mr-1 mt-2">
            <AILogo isShowAIIcon={isShowAIIcon} isGenerating={isGenerating} />
          </div>
          {isShowAIIcon && isGenerating && (
            <div className="px-4 py-1">
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
          )}
        </div>
        <div
          className={cn(
            "h-fit w-full flex text-wrap",
            role === "human" ? "justify-end" : "justify-start"
          )}
        >
          {role === "human" && (
            <HumanBubble role={role} content={content} createdAt={createdAt} />
          )}
          {role === "ai" && (
            <AIBubble role={role} content={content} createdAt={createdAt} />
          )}
          {role === "tool" && (
            <ToolBubble
              role={role}
              content={content}
              createdAt={createdAt}
              additionalKwargs={additionalKwargs}
            />
          )}
        </div>
      </div>
    </>
  );
};
