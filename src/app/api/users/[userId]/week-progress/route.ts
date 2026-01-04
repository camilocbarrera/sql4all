import { auth } from "@clerk/nextjs/server";
import { and, eq, gte } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { submissions } from "@/lib/db/schema";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId: authUserId } = await auth();
  const { userId } = await params;

  if (!authUserId || authUserId !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const userSubmissions = await db
      .select({ createdAt: submissions.createdAt })
      .from(submissions)
      .where(
        and(
          eq(submissions.userId, userId),
          gte(submissions.createdAt, startOfWeek),
        ),
      );

    const daysWithSubmissions = new Set(
      userSubmissions.map((sub) => {
        const date = new Date(sub.createdAt);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      }),
    );

    const weekProgress = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekProgress.push({
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        completed: daysWithSubmissions.has(date.getTime()),
      });
    }

    return NextResponse.json({ progress: weekProgress });
  } catch (error) {
    console.error("Error fetching week progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
