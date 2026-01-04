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
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);

    const userSubmissions = await db
      .select({ createdAt: submissions.createdAt })
      .from(submissions)
      .where(
        and(
          eq(submissions.userId, userId),
          gte(submissions.createdAt, startOfYear),
        ),
      );

    const submissionDates = userSubmissions.map((sub) =>
      sub.createdAt.toISOString(),
    );

    return NextResponse.json({ dates: submissionDates });
  } catch (error) {
    console.error("Error fetching heatmap data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
