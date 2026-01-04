import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { exercises } from "@/lib/db/schema";

export async function GET() {
  try {
    const data = await db
      .select()
      .from(exercises)
      .where(eq(exercises.isDeleted, false))
      .orderBy(exercises.createdAt);

    const formattedExercises = data.map((ex) => ({
      id: ex.id,
      title: ex.title,
      difficulty: ex.difficulty,
      description: ex.description,
      details: ex.details,
      hint: ex.hint,
      successMessage: ex.successMessage,
      example: ex.example,
      type: ex.type,
      validation: ex.validation,
      createdAt: ex.createdAt,
      updatedAt: ex.updatedAt,
    }));

    return NextResponse.json({ exercises: formattedExercises });
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
