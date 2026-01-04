"use client";

import { ArrowRight, CheckCircle2, Clock, History } from "lucide-react";
import Link from "next/link";
import { Badge, Button } from "@/components/ui";
import { formatDistanceToNow } from "@/lib/utils";

interface HistoryItem {
  exerciseId: string;
  exerciseTitle: string;
  difficulty: string;
  solvedAt: Date;
  score: number;
}

interface ExerciseHistoryProps {
  history: HistoryItem[];
  hasSolvedExercises?: boolean;
}

const difficultyColors: Record<string, string> = {
  Principiante:
    "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  Intermedio:
    "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  Avanzado:
    "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
};

export function ExerciseHistory({
  history,
  hasSolvedExercises,
}: ExerciseHistoryProps) {
  if (!history || history.length === 0) {
    if (hasSolvedExercises) {
      return (
        <div className="rounded-lg border border-border/40 bg-card/30 p-6">
          <div className="flex items-center gap-2 mb-4">
            <History className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Historial</span>
          </div>
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 mb-3">
              <Clock className="h-6 w-6 text-amber-500" />
            </div>
            <p className="text-muted-foreground text-sm">
              Cargando historial...
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className="rounded-lg border border-border/40 bg-card/30 p-6">
        <div className="flex items-center gap-2 mb-4">
          <History className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Historial</span>
        </div>
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted/50 mb-3">
            <CheckCircle2 className="h-6 w-6 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground mb-4 text-sm">
            Aún no has completado ningún ejercicio
          </p>
          <Button asChild size="sm" className="gap-2">
            <Link href="/exercises">
              Empezar a practicar
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/40 bg-card/30 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Historial</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {history.length} completado{history.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Grid of exercises */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
        {history.map((item) => (
          <Link
            key={`${item.exerciseId}-${item.solvedAt.toISOString()}`}
            href={`/exercises/${item.exerciseId}`}
          >
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border/40 hover:bg-primary/5 hover:border-primary/20 transition-all group bg-background/50">
              <div className="shrink-0">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                  {item.exerciseTitle}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge
                    variant="outline"
                    className={`text-[9px] px-1.5 py-0 h-4 ${difficultyColors[item.difficulty] || ""}`}
                  >
                    {item.difficulty.slice(0, 3)}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground/70">
                    {formatDistanceToNow(item.solvedAt)}
                  </span>
                </div>
              </div>
              <div className="shrink-0">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  +{item.score}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
