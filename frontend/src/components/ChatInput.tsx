// import React from 'react'

import React, { useState } from "react";
import InputText from "./ui/InputText";
import SubmitButton from "./ui/SubmitButton";
import { cn } from "@/lib/utils";

type ChatInputType = {
  className?: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
};

const ChatInput = ({ className, onSubmit }: ChatInputType = {}) => {
  const [value, setValue] = useState("");

  const handleSubmitInput = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("submit input");
    onSubmit?.(e);
    setValue("");
  };

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmitInput(e);
  };
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setValue(e.target.value);
  };
  return (
    <>
      <form
        onSubmit={handleSubmitForm}
        className={cn(
          "shadow-xl outline-1 outline-black focus-within:outline-blue-500 rounded-xl flex",
          "",
          className
        )}
      >
        <InputText
          onChange={handleChange}
          value={value}
          initRow={1}
          onSubmit={handleSubmitInput}
          placeholder="Ask anything"
          className=""
        />
        {/* {value.length > 0 && <SubmitButton onClick={handleSubmitInput} />} */}
        <SubmitButton
          className={"rounded-full m-2 justify-center align-middle"}
          disabled={value.length === 0}
        />
      </form>
    </>
  );
};

export default ChatInput;
