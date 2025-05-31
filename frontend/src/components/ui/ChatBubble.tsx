import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { useState } from "react";

import { MarkdownComponents } from "../utils/markdown";
import Markdown from "react-markdown";
import { RiRobot2Line } from "react-icons/ri";

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
      <ReactMarkdown components={MarkdownComponents}>{content}</ReactMarkdown>
    </div>
  );
};
const ToolBubble = ({ content }: ChatBubbleProps) => {
  const [isShowDetails, setIsShowDetails] = useState(false);

  const handleToggleDetails = () => {
    setIsShowDetails(!isShowDetails);
  };

  const toolCallDetails = JSON.parse(content);

  return (
    <div className="max-w-3/5 relative flex flex-row gap-4 rounded-xl bg-gray-100 px-4 py-1 items-center">
      <div
        className={cn(
          "h-4 w-4 absolute left-1 top-1 bg-red-400 transition-all duration-600 ease-in-out cursor-pointer",
          isShowDetails && "rotate-45"
        )}
        onClick={handleToggleDetails}
      ></div>
      {!isShowDetails && (
        <div className="flex flex-col">
          {Object.entries(toolCallDetails).map(([key, value]) =>
            key === "status" ? (
              <div key={key} className="text-sm text-gray-700">
                <span className="font-semibold">{key}:</span> {String(value)}
              </div>
            ) : (
              <div key={key} className="text-sm text-gray-700">
                <span className="font-semibold">{key}:</span> {String(value)}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

const AILogo = ({ isShowAIIcon = false }: AILogoProps) => {
  return isShowAIIcon ? (
    <div className="relative size-full block">
      <RiRobot2Line className="absolute size-full top-1/2 left-1/2 -translate-1/2" />
    </div>
  ) : null;
};

export const ChatBubble = ({
  role,
  content,
  createdAt,
  isShowAIIcon,
  isGenerating,
}: ChatBubbleProps) => {
  return (
    <>
      <div className="relative w-full mt-2">
        <div className="size-7 absolute right-full mr-1 mt-2">
          <AILogo isShowAIIcon={isShowAIIcon} isGenerating={isGenerating} />
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
            <ToolBubble role={role} content={content} createdAt={createdAt} />
          )}
        </div>
      </div>
    </>
  );
};
