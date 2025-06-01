import { useContext } from "react";
import {ChatContext} from "@/context/ChatContext";


const useChatData = () => {
  const context = useContext(ChatContext);
    if (!context) {
      throw new Error('useChatData must be used within an ChatProvider');
    }
    return context;
};

export default useChatData;