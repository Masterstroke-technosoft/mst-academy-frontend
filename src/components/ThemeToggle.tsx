"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      suppressHydrationWarning
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] p-2 text-[var(--text-muted)] transition hover:border-mst-red hover:text-mst-red active:scale-95 touch-manipulation cursor-pointer shrink-0 ${className}`}
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
      ) : (
        <Sun className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
      )}
    </button>
  );
}
