import useTextHeight from "../../hooks/useInputHeight";

interface InputTextProps {
  className?: string;
  id?: string;
  placeholder?: string;
  name?: string;
  value?: string;
  disabled?: boolean;
  initRow?: number;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

const maxHeight = 150;
const minHeight = 10;

const InputText = ({
  className,
  id,
  placeholder,
  name,
  disabled,
  value,
  initRow = 1,
  onChange,
  onSubmit,
}: InputTextProps) => {
  const { ref: textareaRef } = useTextHeight({
    value: value,
    maxHeight: maxHeight,
    minHeight: minHeight,
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit?.(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <textarea
      disabled={disabled}
      ref={textareaRef}
      rows={initRow}
      name={name}
      id={id}
      className={`resize-none overflow-hidden w-full p-2 rounded
        whitespace-pre-wrap break-words focus:outline-none ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={handleOnChange}
      onKeyDown={handleKeyDown}
      style={{ minHeight: `${minHeight}px` }}
    />
  );
};

export default InputText;
