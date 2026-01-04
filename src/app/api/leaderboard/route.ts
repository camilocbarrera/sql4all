import { desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { profiles, submissions } from "@/lib/db/schema";

export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every 60 seconds

interface LeaderboardEntry {
  userId: string;
  displayName: string;
  imageUrl: string | null;
  countryCode: string | null;
  totalScore: number;
  exercisesSolved: number;
  rank: number;
}

export async function GET() {
  try {
    // Query with LEFT JOIN to profiles table
    const leaderboard = await db
      .select({
        userId: submissions.userId,
        displayName: profiles.displayName,
        imageUrl: profiles.imageUrl,
        countryCode: profiles.countryCode,
        totalScore: sql<number>`COALESCE(SUM(${submissions.score}), 0)::int`,
        exercisesSolved: sql<number>`COUNT(DISTINCT ${submissions.exerciseId})::int`,
      })
      .from(submissions)
      .leftJoin(profiles, eq(submissions.userId, profiles.id))
      .groupBy(
        submissions.userId,
        profiles.displayName,
        profiles.imageUrl,
        profiles.countryCode,
      )
      .orderBy(desc(sql`SUM(${submissions.score})`));

    const rankedLeaderboard: LeaderboardEntry[] = leaderboard.map(
      (entry, index) => ({
        userId: entry.userId,
        displayName: entry.displayName || `User ${entry.userId.slice(0, 6)}`,
        imageUrl: entry.imageUrl,
        countryCode: entry.countryCode,
        totalScore: entry.totalScore,
        exercisesSolved: entry.exercisesSolved,
        rank: index + 1,
      }),
    );

    return NextResponse.json({
      leaderboard: rankedLeaderboard,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
