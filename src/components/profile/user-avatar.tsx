"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name?: string | null;
  score: number;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

// Level tiers based on score
const getLevelTier = (score: number) => {
  if (score >= 100) return { tier: "Maestro", level: 4 };
  if (score >= 50) return { tier: "Experto", level: 3 };
  if (score >= 20) return { tier: "Intermedio", level: 2 };
  return { tier: "Principiante", level: 1 };
};

const getInitials = (name?: string | null) => {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-16 w-16 text-lg",
};

export function UserAvatar({ name, size = "md", className }: UserAvatarProps) {
  const initials = useMemo(() => getInitials(name), [name]);

  return (
    <div
      className={cn(
        "rounded-full bg-primary/10 text-primary font-medium flex items-center justify-center",
        sizeClasses[size],
        className,
      )}
      title={name || "Usuario"}
    >
      {initials}
    </div>
  );
}

export function LevelBadge({ score }: { score: number }) {
  const { tier, level } = useMemo(() => getLevelTier(score), [score]);

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
      Nv.{level} · {tier}
    </span>
  );
}

export { getLevelTier };
