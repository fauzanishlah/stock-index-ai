// import React from "react";

import { useNavigate } from "react-router-dom";
import { ToggleButton } from "./ToggleButton";
import { NewChatButton } from "./NewChatButton";
import { cn } from "@/lib/utils";
// import { useChat } from "@/hooks/useChat";

interface HeaderSidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const SidebarLogo = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  const appName = "InvestmentAI";
  const initial = appName.charAt(0);
  return (
    <div className="flex items-center justify-between px-4 py-5">
      <div
        className={cn(
          "flex items-center gap-3 overflow-hidden transition-all duration-300",
          isOpen ? "w-full" : "w-0"
        )}
      >
        {/* Gradient Text Logo */}
        <h1
          onClick={onClick}
          className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          {appName}
        </h1>

        {/* Optional AI Badge */}
        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
          AI
        </span>
      </div>

      {/* Initial Badge */}
      <div
        className={cn(
          "shrink-0 transition-all duration-300",
          isOpen ? "opacity-0 w-0" : "opacity-100 w-full text-center"
        )}
      >
        <div
          onClick={onClick}
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          {initial}
        </div>
      </div>
    </div>
  );
};

const HeaderSidebar = ({ isOpen, toggle }: HeaderSidebarProps) => {
  const navigate = useNavigate();
  // const { createNewSession } = useChat();
  const handleNewChat = () => {
    navigate("/");
    // createNewSession();
  };
  return (
    <>
      <div className={cn("flex w-full", isOpen ? "flex-row" : "flex-col")}>
        <div className="w-full">
          <SidebarLogo isOpen={isOpen} onClick={handleNewChat} />
        </div>
        <ToggleButton isOpen={isOpen} toggle={toggle} />
      </div>
      <NewChatButton onClick={handleNewChat} isOpen={isOpen} />
    </>
  );
};

export default HeaderSidebar;
