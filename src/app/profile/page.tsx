"use client";

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  ExerciseHistory,
  GitHubHeatmap,
  LevelBadge,
  StatsGrid,
  UserAvatar,
} from "@/components/profile";
import { Button, Skeleton } from "@/components/ui";
import { useHeatmapData, useUserHistory } from "@/hooks/use-profile";
import {
  useSolvedExercises,
  useUserScore,
  useUserStreak,
} from "@/hooks/use-submissions";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { data: score, isLoading: scoreLoading } = useUserScore();
  const { data: streak, isLoading: streakLoading } = useUserStreak();
  const { data: solvedExercises } = useSolvedExercises();
  const { data: history, isLoading: historyLoading } = useUserHistory();
  const { data: heatmapDates, isLoading: heatmapLoading } = useHeatmapData();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || !user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-8">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  const isLoading = scoreLoading || streakLoading;

  const historyItems = Array.isArray(history)
    ? history.map((item) => ({
        ...item,
        solvedAt: new Date(item.solvedAt),
      }))
    : [];

  // Get total exercises from a fetch (we'll use a rough estimate for now)
  const totalExercises = 15; // TODO: fetch from API

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
        </div>

        {/* Profile Header */}
        <div className="flex items-center gap-4">
          <UserAvatar
            name={user.fullName || user.username}
            score={score || 0}
            size="lg"
          />
          <div>
            <h1 className="text-lg font-semibold">
              {user.fullName || user.username || "Usuario"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
          <div className="ml-auto">
            <LevelBadge score={score || 0} />
          </div>
        </div>

        {/* GitHub Style Heatmap Banner */}
        <div className="rounded-lg border border-border/40 bg-card/30 px-5 py-4">
          {heatmapLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <GitHubHeatmap submissionDates={heatmapDates || []} />
          )}
        </div>

        {/* Stats Grid */}
        {isLoading ? (
          <div className="grid grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : (
          <StatsGrid
            score={score || 0}
            streak={streak || 0}
            totalSolved={solvedExercises?.size || 0}
            totalExercises={totalExercises}
          />
        )}

        {/* Exercise History */}
        {historyLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <ExerciseHistory
            history={historyItems}
            hasSolvedExercises={solvedExercises && solvedExercises.size > 0}
          />
        )}
      </motion.div>
    </div>
  );
}
