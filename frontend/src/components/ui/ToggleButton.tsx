import { cn } from "@/lib/utils";

interface ToggleButtonProps {
  isOpen: boolean;
  toggle: () => void;
}

export const ToggleButton = ({ isOpen, toggle }: ToggleButtonProps) => (
  <button
    onClick={toggle}
    className={cn(
      "p-2 h-full hover:bg-gray-100 duration-300 flex items-center justify-center",
      isOpen ? "min-w-16 self-end rounded-sm" : "my-3 w-full self-end"
    )}
  >
    {isOpen ? (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    ) : (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    )}
  </button>
);
