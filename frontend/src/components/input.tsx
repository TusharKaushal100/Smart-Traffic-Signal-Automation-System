import React from "react";

interface InputProps {
  placeholder: string;
  defaultStyle?: string;
  type?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ placeholder, defaultStyle = "", type = "text" }, ref) => {
    return (
      <div>
        <input
          ref={ref}   // ✅ ref correctly forwarded
          type={type}
          placeholder={placeholder}
          className={`rounded-md p-2 m-2 bg-white text-black border border-black hover:bg-gray-300 ${defaultStyle}`}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
