"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/cn";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    localStorage.setItem("theme", "dark");
    document.documentElement.setAttribute("data-theme", "dark");
    document.documentElement.classList.add("dark");
  }, []);

  const toggleTheme = () => {
    // Monochromatic Noir Arena is strictly dark
    document.documentElement.setAttribute("data-theme", "dark");
    document.documentElement.classList.add("dark");
  };

  if (!mounted) {
    return <div className={cn("h-9 w-9 rounded-md", className)} aria-hidden="true" />;
  }

  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md border border-line-strong bg-surface text-text transition-all duration-200 hover:border-primary/60 hover:bg-surface-2",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        className
      )}
      aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
      aria-checked={theme === "dark"}
      role="switch"
      onClick={toggleTheme}
    >
      <Sun aria-hidden="true" className="h-4 w-4 dark:hidden" />
      <Moon aria-hidden="true" className="hidden h-4 w-4 dark:block" />
    </button>
  );
}
