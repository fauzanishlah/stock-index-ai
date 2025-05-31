import { cn } from "@/lib/utils";
import { memo } from "react";
import { FiSend } from "react-icons/fi";

interface SubmitButtonProp {
  className?: string;
  onClick?: () => void;
  onSubmit?: () => void;
  disabled?: boolean;
}

const SubmitButton = memo(
  ({ className, onClick, onSubmit, disabled }: SubmitButtonProp) => {
    return (
      <button
        className={cn(
          "p-2 size-8 rounded-lg outline-1 outline-blue-500 text-blue-500",
          !disabled
            ? "hover:bg-blue-500 hover:text-white cursor-pointer"
            : "cursor-not-allowed",
          className
        )}
        // className={`p-2 rounded-lg outline-1 outline-blue-500 text-blue-500 ${
        //   !disabled
        //     ? "hover:bg-blue-500 hover:text-white cursor-pointer"
        //     : "cursor-not-allowed"
        // } ${className}`}
        onClick={onClick}
        onSubmit={onSubmit}
      >
        <FiSend className="w-4 h-4" />
      </button>
    );
  }
);

export default SubmitButton;
