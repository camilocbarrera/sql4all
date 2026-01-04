"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useRef } from "react";
import { Button } from "@/components/ui";
import { useThemeStore } from "@/stores/theme-store";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { startTransition, endTransition } = useThemeStore();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggle = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = event.clientX;
      const y = event.clientY;

      const newTheme = theme === "light" ? "dark" : "light";

      // Check if View Transitions API is supported
      if (!document.startViewTransition) {
        setTheme(newTheme);
        return;
      }

      startTransition(x, y);

      const transition = document.startViewTransition(() => {
        setTheme(newTheme);
      });

      try {
        await transition.ready;

        const maxRadius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y),
        );

        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${maxRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 500,
            easing: "ease-out",
            pseudoElement: "::view-transition-new(root)",
          },
        );

        await transition.finished;
      } finally {
        endTransition();
      }
    },
    [theme, setTheme, startTransition, endTransition],
  );

  return (
    <Button
      ref={buttonRef}
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="relative overflow-hidden"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
