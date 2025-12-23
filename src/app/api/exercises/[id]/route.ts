import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { exercises } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const [exercise] = await db
      .select()
      .from(exercises)
      .where(and(eq(exercises.id, id), eq(exercises.isDeleted, false)))
      .limit(1)

    if (!exercise) {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      exercise: {
        id: exercise.id,
        title: exercise.title,
        difficulty: exercise.difficulty,
        description: exercise.description,
        details: exercise.details,
        hint: exercise.hint,
        successMessage: exercise.successMessage,
        example: exercise.example,
        validation: exercise.validation,
        createdAt: exercise.createdAt,
        updatedAt: exercise.updatedAt,
      },
    })
  } catch (error) {
    console.error('Error fetching exercise:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

