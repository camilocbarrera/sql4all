import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { submissions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId: authUserId } = await auth()
  const { userId } = await params

  if (!authUserId || authUserId !== userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const userSubmissions = await db
      .select({
        exerciseId: submissions.exerciseId,
        score: submissions.score,
      })
      .from(submissions)
      .where(eq(submissions.userId, userId))

    const exerciseScores = new Map<string, number>()
    userSubmissions.forEach((sub) => {
      const current = exerciseScores.get(sub.exerciseId) || 0
      exerciseScores.set(sub.exerciseId, Math.max(current, sub.score))
    })

    const totalScore = Array.from(exerciseScores.values()).reduce(
      (sum, score) => sum + score,
      0
    )

    console.log('Score calculated:', { userId, exerciseCount: exerciseScores.size, totalScore })

    return NextResponse.json({ score: totalScore })
  } catch (error) {
    console.error('Error fetching score:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
