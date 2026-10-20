import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className = "", type, disabled, ...props }) => {
  return (
    <input
      type={type}
      className={`w-full px-3 py-2 rounded-md border border-line-strong bg-surface-2 text-text font-mono text-sm placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent disabled:opacity-50 ${className}`}
      disabled={disabled}
      {...props}
    />
  );
};
