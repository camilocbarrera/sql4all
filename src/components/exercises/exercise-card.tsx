"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/validations";

type Difficulty = "Principiante" | "Intermedio" | "Avanzado";

const difficultyBadgeStyles: Record<Difficulty, string> = {
  Principiante:
    "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  Intermedio:
    "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  Avanzado:
    "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
};

const difficultyCardStyles: Record<Difficulty, string> = {
  Principiante: "border-l-4 border-l-emerald-500 hover:border-l-emerald-400",
  Intermedio: "border-l-4 border-l-amber-500 hover:border-l-amber-400",
  Avanzado:
    "border-l-4 border-l-rose-500 bg-gradient-to-r from-rose-500/5 to-transparent hover:border-l-rose-400",
};

interface ExerciseCardProps {
  exercise: Exercise;
  isSolved?: boolean;
}

export function ExerciseCard({ exercise, isSolved }: ExerciseCardProps) {
  const difficulty = exercise.difficulty as Difficulty;

  return (
    <Link href={`/exercises/${exercise.id}`} className="block h-full group">
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.15 }}
        className="h-full"
      >
        <Card
          className={cn(
            "h-full cursor-pointer transition-all duration-200",
            "hover:shadow-lg hover:shadow-primary/5",
            "bg-card/80 backdrop-blur-sm",
            difficultyCardStyles[difficulty],
            isSolved && "ring-1 ring-emerald-500/30 bg-emerald-500/5",
          )}
        >
          <CardHeader className="p-4 pb-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Badge
                  variant="outline"
                  className={cn(
                    "shrink-0 text-[10px] px-1.5 py-0",
                    difficultyBadgeStyles[difficulty],
                  )}
                >
                  {difficulty.slice(0, 3)}
                </Badge>
                <CardTitle className="text-sm font-medium line-clamp-1 leading-tight">
                  {exercise.title}
                </CardTitle>
              </div>
              {isSolved && (
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-xs text-muted-foreground line-clamp-2">
              {exercise.description}
            </p>
            <div className="flex items-center justify-end mt-3">
              <ArrowRight
                className={cn(
                  "h-3.5 w-3.5 transition-all duration-200 group-hover:translate-x-1",
                  difficulty === "Principiante" &&
                    "text-emerald-500/60 group-hover:text-emerald-500",
                  difficulty === "Intermedio" &&
                    "text-amber-500/60 group-hover:text-amber-500",
                  difficulty === "Avanzado" &&
                    "text-rose-500/60 group-hover:text-rose-500",
                )}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
