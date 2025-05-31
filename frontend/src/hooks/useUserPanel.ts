import { useContext } from "react";
import { UserPanelContext } from "@/context/UserPanelContext";


export const useUserPanel = () => {
    const context = useContext(UserPanelContext);
        if (!context) {
            throw new Error('useAuth must be used within an AuthProvider');
        }
        return context;
};