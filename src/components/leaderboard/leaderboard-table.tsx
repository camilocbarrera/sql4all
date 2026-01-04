"use client";

import { motion } from "framer-motion";
import { Award, Medal, TrendingUp, Trophy, User } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  userId: string;
  displayName: string;
  imageUrl: string | null;
  countryCode: string | null;
  totalScore: number;
  exercisesSolved: number;
  rank: number;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string | null;
}

function getRankIcon(rank: number) {
  if (rank === 1) return <Trophy className="h-5 w-5 text-primary" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-muted-foreground" />;
  if (rank === 3) return <Award className="h-5 w-5 text-muted-foreground/70" />;
  return null;
}

function getRankStyle(rank: number) {
  if (rank === 1) return "bg-primary/5 border-primary/20";
  if (rank === 2) return "bg-muted/40 border-border/50";
  if (rank === 3) return "bg-muted/30 border-border/40";
  return "border-border/30 hover:bg-muted/20";
}

function countryCodeToFlag(code: string | null): string | null {
  if (!code || code.length !== 2) return null;
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export function LeaderboardTable({
  entries,
  currentUserId,
}: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="h-5 w-5 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground/60 text-xs">Sin datos aún</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {entries.map((entry, index) => {
        const isCurrentUser = currentUserId === entry.userId;
        const rankIcon = getRankIcon(entry.rank);
        const rankStyle = getRankStyle(entry.rank);

        return (
          <motion.div
            key={entry.userId}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02, duration: 0.15 }}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all",
              rankStyle,
              isCurrentUser && "ring-1 ring-primary/30 bg-primary/5",
            )}
          >
            {/* Rank */}
            <div className="shrink-0 w-8 flex items-center justify-center">
              {rankIcon ? (
                <span className="scale-90">{rankIcon}</span>
              ) : (
                <span className="text-sm font-medium text-muted-foreground tabular-nums">
                  {entry.rank}
                </span>
              )}
            </div>

            {/* Avatar */}
            <div className="shrink-0">
              {entry.imageUrl ? (
                <Image
                  src={entry.imageUrl}
                  alt={entry.displayName}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0 flex items-center gap-2">
              {entry.countryCode && (
                <span className="text-sm shrink-0" title={entry.countryCode}>
                  {countryCodeToFlag(entry.countryCode)}
                </span>
              )}
              <p
                className={cn(
                  "text-sm font-medium truncate",
                  isCurrentUser && "text-primary",
                )}
              >
                {entry.displayName}
              </p>
              {isCurrentUser && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium shrink-0">
                  tú
                </span>
              )}
            </div>

            {/* Score */}
            <div className="shrink-0 flex items-center gap-1">
              <span
                className={cn(
                  "text-sm font-semibold tabular-nums",
                  entry.rank === 1 && "text-primary",
                  entry.rank === 2 && "text-foreground",
                  entry.rank === 3 && "text-foreground/90",
                  entry.rank > 3 && "text-muted-foreground",
                )}
              >
                {entry.totalScore.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground/60">pts</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
