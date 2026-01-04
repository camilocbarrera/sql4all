"use client";

import { CheckCircle2, Flame, Target, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui";

interface StatsGridProps {
  score: number;
  streak: number;
  totalSolved: number;
  totalExercises: number;
}

export function StatsGrid({
  score,
  streak,
  totalSolved,
  totalExercises,
}: StatsGridProps) {
  const completionRate =
    totalExercises > 0 ? Math.round((totalSolved / totalExercises) * 100) : 0;

  const stats = [
    { label: "Puntos", value: score, icon: Trophy },
    { label: "Racha", value: `${streak}d`, icon: Flame },
    { label: "Resueltos", value: totalSolved, icon: CheckCircle2 },
    { label: "Progreso", value: `${completionRate}%`, icon: Target },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="border-border/40">
            <CardContent className="p-3 text-center">
              <Icon className="h-4 w-4 text-muted-foreground/60 mx-auto mb-1" />
              <p className="text-lg font-semibold">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
