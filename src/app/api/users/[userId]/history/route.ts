import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { submissions, exercises } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

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
    const userHistory = await db
      .select({
        exerciseId: submissions.exerciseId,
        exerciseTitle: exercises.title,
        difficulty: exercises.difficulty,
        solvedAt: submissions.createdAt,
        score: submissions.score,
      })
      .from(submissions)
      .innerJoin(exercises, eq(submissions.exerciseId, exercises.id))
      .where(eq(submissions.userId, userId))
      .orderBy(desc(submissions.createdAt))

    // Remove duplicates, keeping only the most recent submission per exercise
    const uniqueHistory = userHistory.reduce<typeof userHistory>((acc, item) => {
      if (!acc.find((x) => x.exerciseId === item.exerciseId)) {
        acc.push(item)
      }
      return acc
    }, [])

    console.log('[History API] User history:', {
      userId,
      totalSubmissions: userHistory.length,
      uniqueHistory: uniqueHistory.length,
      sample: uniqueHistory[0]
    })

    return NextResponse.json({ history: uniqueHistory })
  } catch (error) {
    console.error('Error fetching history:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

