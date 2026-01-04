import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
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
    const userSubmissions = await db
      .select({ exerciseId: submissions.exerciseId })
      .from(submissions)
      .where(eq(submissions.userId, userId));

    const exerciseIds = [
      ...new Set(userSubmissions.map((sub) => sub.exerciseId)),
    ];

    console.log("Fetched solved exercises:", {
      userId,
      count: exerciseIds.length,
      exerciseIds,
    });

    return NextResponse.json({ exerciseIds });
  } catch (error) {
    console.error("Error fetching solved exercises:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
