import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { FiUser } from "react-icons/fi";
import ProfilePanel from "./ProfilePanel";
// import { UserPanelProvider } from "@/context/UserPanelContext";
import { useUserPanel } from "@/hooks/useUserPanel";
import { useClickOutside } from "@/hooks/useClickOutside";

interface ProfileIconProps {
  isOpen: boolean;
}

const ProfileIcon = ({ isOpen }: ProfileIconProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  const { isOpenPanel, setIsOpenPanel } = useUserPanel();
  // const [isShowPanel, setIsShowPanel] = useState(false);

  // const { user, error, login, logout } = useAuth();

  // const handleLogin = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   login(username, password);
  //   console.log("login");
  // };

  // console.log(user);

  useClickOutside([panelRef], () => {
    setIsOpenPanel(false);
  });

  useEffect(() => {
    setIsOpenPanel(false);
    return () => {};
  }, [isOpen]);

  const handleToggleShowPanel = () => {
    setIsOpenPanel(!isOpenPanel);
  };

  const closePanel = () => {
    setIsOpenPanel(false);
  };

  return (
    <div className="mt-auto p-2 relative" ref={panelRef}>
      <div className="flex justify-center">
        <button
          className={cn(
            "border border-blue-500 shadow hover:shadow-2xl bg-white flex self-center gap-3 p-2 hover:bg-blue-500 hover:text-white",
            isOpen ? "w-full rounded-md" : "w-fit rounded-full"
          )}
          onClick={handleToggleShowPanel}
        >
          <FiUser className="w-6 h-6" />
          {isOpen && <span className="text-sm">Profile</span>}
        </button>
      </div>
      {isOpenPanel && (
        <ProfilePanel isOpen={isOpen} onSuccessLogin={closePanel} />
      )}
    </div>
  );
};

export default ProfileIcon;
