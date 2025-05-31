import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useNavigate } from "react-router-dom";
import useChatData from "@/hooks/useChatData";
import UserProfileModal from "../UserProfileModal";

// import { on } from "events";

interface ProfilePanelProps {
  isOpen: boolean;
  onSuccessLogin: () => void;
}

const ProfilePanel = ({ isOpen, onSuccessLogin }: ProfilePanelProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { user, error, login, logout } = useAuth();
  const { clearChat } = useChatData();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const onSuccessLoginForm = async () => {
    onSuccessLogin();
    navigate("/");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password, onSuccessLoginForm);
  };

  const handleLogout = async () => {
    navigate("/");
    await clearChat();
    logout();
  };

  const handleSuccessRegister = () => {
    navigate("/");
    setIsRegister(false);
  };

  const toggleRegister = () => {
    console.log("toggle register", isRegister);
    setIsRegister(!isRegister);
  };

  const handleCloseProfile = () => {
    console.log("close profile", isOpenProfile);

    setIsOpenProfile(false);
  };

  const toggleProfile = () => {
    console.log("toggle profile", isOpenProfile);
    setIsOpenProfile((prev) => !prev);
  };

  return (
    <div
      className={cn(
        "bg-white border border-blue-300 shadow-lg rounded-md absolute p-3 left-2 bottom-full w-full transition-all duration-0",
        !isOpen && "w-64"
      )}
    >
      {user ? (
        <div className="space-y-2">
          <p className="text-xl font-medium">
            Hi, {user.full_name ? user.full_name : user.username}
          </p>
          <button
            onClick={toggleProfile}
            className="w-full rounded-md bg-blue-500 px-0 py-2 text-sm text-white hover:bg-blue-700"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="w-full rounded-md bg-red-500 px-0 py-2 text-sm text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      ) : (
        <>
          <div className={`${isRegister ? "hidden" : ""}`}>
            <LoginForm
              username={username}
              password={password}
              error={error}
              onSubmit={handleLogin}
              onSetUsername={setUsername}
              onSetPassword={setPassword}
            />
          </div>
          <div className={`${isRegister ? "" : "hidden"}`}>
            <RegisterForm
              onSubmit={() => {}}
              onSuccessRegister={handleSuccessRegister}
            />
          </div>
          <button onClick={toggleRegister}>
            <span>{isRegister ? "Login" : "Register"}</span>
          </button>
        </>
      )}
      <UserProfileModal isOpen={isOpenProfile} onClose={handleCloseProfile} />
    </div>
  );
};

export default ProfilePanel;
