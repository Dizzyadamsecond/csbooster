import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const variants: Record<string, string> = {
    primary:
      "bg-red-600 text-text hover:bg-red-700 focus:ring-red-600 shadow-sm",
    secondary:
      "bg-transparent text-text hover:bg-surface-2 focus:ring-red-600",
    ghost:
      "bg-transparent text-muted hover:text-text hover:bg-surface-2 focus:ring-red-600",
    outline:
      "border border-line-strong bg-transparent text-text hover:bg-surface-2 focus:ring-red-600",
    danger:
      "bg-red-600 text-text hover:bg-red-700 focus:ring-red-600 shadow-sm",
  };

  const sizes: Record<string, string> = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export const ButtonLink: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: string; size?: string }> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const variants: Record<string, string> = {
    primary:
      "bg-red-600 text-text hover:bg-red-700 focus:ring-red-600 shadow-sm",
    secondary:
      "bg-transparent text-text hover:bg-surface-2 focus:ring-red-600",
    ghost:
      "bg-transparent text-muted hover:text-text hover:bg-surface-2 focus:ring-red-600",
    outline:
      "border border-line-strong bg-transparent text-text hover:bg-surface-2 focus:ring-red-600",
  };

  const sizes: Record<string, string> = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-6 py-3 text-base",
  };

  return (
    <a
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
};
