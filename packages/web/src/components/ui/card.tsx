import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`bg-surface border border-line-strong rounded-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = "", ...props }) => {
  return (
    <div className={`p-4 border-b border-line ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = "", ...props }) => {
  return (
    <h3
      className={`text-xl font-bold text-text tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardContent: React.FC<CardContentProps> = ({ children, className = "", ...props }) => {
  return <div className={`p-4 ${className}`} {...props}>{children}</div>;
};
