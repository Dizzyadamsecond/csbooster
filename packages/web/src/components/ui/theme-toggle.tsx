/**
 * Theme Toggle Component — MonoRed
 * - light is the default theme; preference persists in localStorage
 */
"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/cn";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme");
    const current = saved === "dark" ? "dark" : "light";
    setTheme(current);
    document.documentElement.setAttribute("data-theme", current);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  if (!mounted) {
    return <div className={cn("w-9 h-9 rounded-md", className)} aria-hidden="true" />;
  }

  return (
    <button
      className={cn(
        "theme-toggle inline-flex items-center justify-center h-9 w-9 rounded-md border border-line-strong bg-surface transition-all duration-200 hover:bg-surface-2 hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
        className
      )}
      aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
      aria-checked={theme === "dark"}
      role="switch"
      onClick={toggleTheme}
    >
      <Sun className="sun-icon w-4 h-4" />
      <Moon className="moon-icon w-4 h-4" />
    </button>
  );
}
