import React from "react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select: React.FC<SelectProps> = ({ className = "", disabled, ...props }) => {
  return (
    <select
      className={`w-full px-3 py-2 rounded-md border border-line-strong bg-surface-2 text-text font-mono text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 ${className}`}
      disabled={disabled}
      {...props}
    >
      {props.children}
    </select>
  );
};

export const SelectTrigger: React.FC<React.HTMLAttributes<HTMLSelectElement>> = ({
  className = "",
  ...props
}) => {
  return <Select className={className} {...props} />;
};

export const SelectValue: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <span className="pl-2 text-text">{children}</span>;
};

export const SelectContent: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return <Select className={className} {...props}>{children}</Select>;
};

export const SelectItem: React.FC<React.SelectHTMLAttributes<HTMLOptionElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return <option className={className} {...props}>{children}</option>;
};
