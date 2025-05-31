interface ChatLoadingCircleProps {
  className?: string;
}

const ChatLoadingCircle = ({ className }: ChatLoadingCircleProps) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 rounded-full border-2 border-gray-300"></div>
      <div
        className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-600 border-r-purple-600 animate-spin"
        style={{
          background:
            "conic-gradient(from 90deg at 50% 50%, transparent 0%, #3b82f6 30%, #8b5cf6 70%, transparent 100%)",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))",
        }}
      ></div>
    </div>
  );
};

export default ChatLoadingCircle;
