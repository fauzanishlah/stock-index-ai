import { useSidebar } from "@/hooks/useSidebar";
import { useParams } from "react-router-dom";
import { ChatList } from "@/components/ui/ChatList";
import { cn } from "@/lib/utils";
import ProfileIcon from "./ui/ProfileIcon";
import HeaderSidebar from "./ui/HeaderSidebar";
import useChatData from "@/hooks/useChatData";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export const Sidebar = () => {
  const { isOpen, toggle } = useSidebar();
  const { chatSessions, loadingSessions, errorSessions, fetchChatSessions } =
    useChatData();
  const { chatId } = useParams();
  const { user } = useAuth();

  const activeChatId = chatId ?? undefined;

  useEffect(() => {
    const fetchData = async () => {
      await fetchChatSessions();
      console.log("chat sessions fetched");
    };
    fetchData();
  }, [user?.id, chatSessions.length, loadingSessions]);
  console.log(chatSessions);
  return (
    <aside
      className={cn(
        "flex flex-col h-screen transition-transformation duration-300",
        " shadow-xs z-10 hover:shadow-xl",
        isOpen ? "w-70" : "w-16"
      )}
    >
      <HeaderSidebar isOpen={isOpen} toggle={toggle}></HeaderSidebar>
      <hr className="mt-2 text-gray-300 shadow-xl" />
      {isOpen && (
        <>
          <h3 className="px-4 text-sm font-medium text-gray-500 mb-2">
            Chat History
          </h3>
          <div className="py-2 overflow-auto">
            {loadingSessions ? (
              <div className="px-4 text-sm text-gray-500">Loading...</div>
            ) : errorSessions ? (
              <div className="px-4 text-sm text-red-500">
                {typeof errorSessions === "string"
                  ? errorSessions
                  : errorSessions instanceof Error
                  ? errorSessions.message
                  : String(errorSessions)}
              </div>
            ) : (
              <div className="grow-1 m-auto w-full flex flex-col">
                <div className="inset-0">
                  {/* <div className="relative flex flex-col w-full h-100 border"> */}
                  {chatSessions.length > 0 ? (
                    <ChatList
                      sessions={chatSessions}
                      activeChatId={activeChatId}
                      isOpen={isOpen}
                    />
                  ) : (
                    <span className="text-sm">No Chat History</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <ProfileIcon isOpen={isOpen} />
    </aside>
  );
};
