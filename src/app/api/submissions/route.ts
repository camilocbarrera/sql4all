import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { exercises, submissions } from "@/lib/db/schema";
import { createSubmissionSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = createSubmissionSchema.safeParse(body);

    if (!parsed.success) {
      console.error("Validation failed:", parsed.error.flatten());
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    // Verify exercise exists
    const [exercise] = await db
      .select({ id: exercises.id })
      .from(exercises)
      .where(eq(exercises.id, parsed.data.exerciseId))
      .limit(1);

    if (!exercise) {
      console.error("Exercise not found:", parsed.data.exerciseId);
      return NextResponse.json(
        { error: "Exercise not found", exerciseId: parsed.data.exerciseId },
        { status: 404 },
      );
    }

    const [submission] = await db
      .insert(submissions)
      .values({
        userId,
        exerciseId: parsed.data.exerciseId,
        solution: parsed.data.solution,
        score: 2,
      })
      .returning();

    console.log("Submission created:", {
      id: submission.id,
      exerciseId: submission.exerciseId,
      userId,
    });

    return NextResponse.json({ submission });
  } catch (error) {
    console.error("Error creating submission:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", details: message },
      { status: 500 },
    );
  }
}
