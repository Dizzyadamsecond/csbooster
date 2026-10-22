"use client";

import React from "react";
import { cn } from "@/lib/cn";
import { Button, ButtonLink } from "./button";
import { Card, CardContent } from "./card";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "ghost" | "outline";
  };
  className?: string;
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <Card variant="glass" className={cn("text-center py-12 px-6", className)}>
      <CardContent className="pt-0">
        {icon && <div className="mx-auto mb-4 text-muted">{icon}</div>}
        <h3 className="text-lg font-bold text-text mb-2">{title}</h3>
        {description && <p className="text-sm text-muted mb-6 max-w-sm mx-auto">{description}</p>}
        {action && (
          action.href ? (
            <ButtonLink href={action.href} variant={action.variant || "primary"} className="w-full sm:w-auto">
              {action.label}
            </ButtonLink>
          ) : (
            <Button variant={action.variant || "primary"} onClick={action.onClick} className="w-full sm:w-auto">
              {action.label}
            </Button>
          )
        )}
      </CardContent>
    </Card>
  );
}

export interface ErrorStateProps {
  title: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function ErrorState({ title, message, onRetry, retryLabel = "Tentar novamente", icon, className }: ErrorStateProps) {
  return (
    <Card variant="outline" className={cn("border-danger/30 bg-danger/5 text-center py-12 px-6", className)}>
      <CardContent className="pt-0">
        {icon && <div className="mx-auto mb-4 text-danger">{icon}</div>}
        <h3 className="text-lg font-bold text-danger mb-2">{title}</h3>
        {message && <p className="text-sm text-muted mb-6 max-w-sm mx-auto">{message}</p>}
        {onRetry && (
          <Button variant="danger" onClick={onRetry} className="w-full sm:w-auto">
            {retryLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export interface LoadingStateProps {
  message?: string;
  className?: string;
  skeleton?: React.ReactNode;
}

export function LoadingState({ message, className, skeleton }: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-6", className)}>
      {skeleton || (
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      )}
      {message && <p className="mt-4 text-sm text-muted">{message}</p>}
    </div>
  );
}