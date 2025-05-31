import { createContext, ReactNode, useState } from "react";

type UserPanelContextType = {
  isOpenPanel: boolean;
  togglePanel: () => void;
  setIsOpenPanel: (isOpenPanel: boolean) => void;
};

export const UserPanelContext = createContext<UserPanelContextType>({
  isOpenPanel: true,
  togglePanel: () => {},
  setIsOpenPanel: () => {},
});

export const UserPanelProvider = ({ children }: { children: ReactNode }) => {
  const [isOpenPanel, setIsOpenPanel] = useState(false);

  const togglePanel = () => {
    setIsOpenPanel((prev) => !prev);
  };

  return (
    <UserPanelContext.Provider
      value={{
        isOpenPanel,
        togglePanel,
        setIsOpenPanel,
      }}
    >
      {children}
    </UserPanelContext.Provider>
  );
};
