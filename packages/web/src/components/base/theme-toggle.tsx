/**
 * Theme Toggle Component
 * - Switches between light/dark modes
 * - Persists preference in localStorage
 * - Respects system preference
 */

"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { clsx } from "clsx";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Get current theme (MonoRed default: light; system pref only on first visit if dark requested explicitly)
    const getCurrentTheme = () => {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
      return "light";
    };

    const current = getCurrentTheme();
    setTheme(current);

    // Apply theme
    document.documentElement.setAttribute("data-theme", current);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  if (!mounted) {
    return (
      <div className={clsx("w-10 h-10 rounded-lg", className)} />
    );
  }

  return (
    <button
      className="theme-toggle flex items-center justify-center h-9 w-9 rounded-lg border border-line bg-surface-2 transition-all duration-200 hover:bg-surface-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
      aria-checked={theme === "dark"}
      onClick={toggleTheme}
    >
      <Sun className="sun-icon w-4 h-4" />
      <Moon className="moon-icon w-4 h-4" />
    </button>
  );
}
