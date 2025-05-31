import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
// import { on } from "events";

interface ProfileSectionProps {
  isOpen: boolean;
}

export const ProfileSection = ({ isOpen }: ProfileSectionProps) => {
  const { user, error, login, logout } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showAuthPanel, setShowAuthPanel] = useState(false);

  const onSuccessLogin = () => {
    console.log("User logged in successfully");
  };

  // const onSuccessLogout = () => {
  //   console.log("User logged out successfully");
  // };
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password, onSuccessLogin);
    setShowAuthPanel(false);
  };

  const handleLogout = () => {
    logout();
    setShowAuthPanel(false);
    console.log("User logged out");
  };

  return (
    <div className="mt-auto border-t p-2">
      <div className="relative">
        <button
          onClick={() => setShowAuthPanel(!showAuthPanel)}
          className="flex w-full items-center gap-3 rounded-md p-2 hover:bg-gray-100"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          {isOpen && !user && <span className="text-sm">Login</span>}
          {isOpen && user && (
            <span className="truncate text-sm">{user.username}</span>
          )}
        </button>

        {showAuthPanel && (
          <div
            className={cn(
              "absolute bottom-full left-0 right-0 mb-2 rounded-md border bg-white p-4 shadow-lg",
              !isOpen && "left-[-200px] w-64"
            )}
          >
            {user ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">{user.username}</p>
                <button
                  onClick={handleLogout}
                  className="w-full rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 w-full rounded-md border p-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full rounded-md border p-2 text-sm"
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  type="submit"
                  className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                >
                  Login
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
