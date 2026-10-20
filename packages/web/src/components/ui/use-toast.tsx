"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

interface Toast {
  id: number;
  message: string;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (message: string) => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let nextId = 0;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string) => {
    const id = ++nextId;
    setToasts((prev) => [...prev, { id, message }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const ctx = {
    toasts,
    addToast,
    removeToast,
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};
