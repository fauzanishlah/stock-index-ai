import { useEffect, useCallback, useRef, RefObject } from "react";

interface UseTextHeightProps {
  maxHeight?: number;
  minHeight?: number;
  value?: string;
}

const useTextHeight = ({
  maxHeight = 200,
  minHeight = 40,
  value,
}: UseTextHeightProps): {
  ref: RefObject<HTMLTextAreaElement | null>;
  adjustHeight: () => void;
} => {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = useCallback(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      const scrollHeight = ref.current.scrollHeight;
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
      ref.current.style.height = `${newHeight}px`;
      ref.current.style.overflowY = newHeight >= maxHeight ? "auto" : "hidden";
    }
  }, [maxHeight, minHeight]);

  useEffect(() => {
    adjustHeight();
  }, [value, maxHeight, minHeight, adjustHeight]);

  return { ref, adjustHeight };
};

export default useTextHeight;
