"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { cn } from "@/lib/utils";

interface WeekDay {
  day: string;
  completed: boolean;
}

interface ActivityHeatmapProps {
  weekProgress: WeekDay[];
  streak: number;
}

export function ActivityHeatmap({
  weekProgress,
  streak,
}: ActivityHeatmapProps) {
  const completedDays = useMemo(
    () => weekProgress.filter((d) => d.completed).length,
    [weekProgress],
  );

  return (
    <Card className="border-border/40">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>Actividad</span>
          <span className="text-xs font-normal text-muted-foreground">
            {completedDays}/7
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {weekProgress.map((day) => (
            <div key={day.day} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-muted-foreground/70">
                {day.day}
              </span>
              <div
                className={cn(
                  "w-7 h-7 rounded flex items-center justify-center text-xs transition-colors",
                  day.completed
                    ? "bg-primary/20 text-primary"
                    : "bg-muted/50 text-muted-foreground/30",
                )}
              >
                {day.completed ? "✓" : "·"}
              </div>
            </div>
          ))}
        </div>

        {streak > 0 && (
          <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Racha actual</span>
            <span className="text-sm font-medium">{streak} días</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
