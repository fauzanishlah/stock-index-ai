// import { Router, Routes } from "react-router-dom";
import "./App.css";
import { Sidebar } from "./components/Sidebar";
import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import { HomePage } from "./components/pages/HomePage";
import { ChatPage } from "./components/pages/ChatPage";
import { AuthProvider } from "./context/AuthContext";
import ChatProvider from "./context/ChatContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Toaster } from "sonner";
import { UserPanelProvider } from "./context/UserPanelContext";
// import ChatInput from "./components/ChatInput";

const Layout = () => {
  return (
    <div className="flex h-screen w-screen border fixed">
      <Sidebar />
      <main className="flex-1 overflow-hidden bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/chat/",
        element: <ChatPage />,
      },
      {
        path: "/chat/:chatId",
        element: <ChatPage />,
      },
    ],
  },
]);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ChatProvider>
          <UserPanelProvider>
            <RouterProvider router={router} />
            <Toaster
              position="top-right"
              expand={false}
              richColors
              closeButton
            />
          </UserPanelProvider>
        </ChatProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
