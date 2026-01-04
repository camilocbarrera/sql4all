import { auth } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { submissions } from "@/lib/db/schema";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string; exerciseId: string }> },
) {
  const { userId: authUserId } = await auth();
  const { userId, exerciseId } = await params;

  if (!authUserId || authUserId !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [submission] = await db
      .select({ solution: submissions.solution })
      .from(submissions)
      .where(
        and(
          eq(submissions.userId, userId),
          eq(submissions.exerciseId, exerciseId),
        ),
      )
      .orderBy(desc(submissions.createdAt))
      .limit(1);

    return NextResponse.json({ solution: submission?.solution || null });
  } catch (error) {
    console.error("Error fetching solution:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
