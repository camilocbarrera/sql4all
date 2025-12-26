import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { submissions } from '@/lib/db/schema'
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
    const userSubmissions = await db
      .select({ createdAt: submissions.createdAt })
      .from(submissions)
      .where(eq(submissions.userId, userId))
      .orderBy(desc(submissions.createdAt))

    if (userSubmissions.length === 0) {
      return NextResponse.json({ streak: 0 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const submissionDates = userSubmissions.map((sub) => {
      const date = new Date(sub.createdAt)
      date.setHours(0, 0, 0, 0)
      return date
    })

    const hasSubmittedToday = submissionDates.some(
      (date) => date.getTime() === today.getTime()
    )

    if (!hasSubmittedToday) {
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const hasSubmittedYesterday = submissionDates.some(
        (date) => date.getTime() === yesterday.getTime()
      )
      if (!hasSubmittedYesterday) {
        return NextResponse.json({ streak: 0 })
      }
    }

    let streak = 0
    const startDate = hasSubmittedToday ? today : new Date(submissionDates[0])
    const checkDate = new Date(startDate)

    while (true) {
      const exists = submissionDates.some(
        (date) => date.getTime() === checkDate.getTime()
      )
      if (!exists) break
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    }

    console.log('Streak calculated:', { userId, streak, submissionCount: userSubmissions.length })
    return NextResponse.json({ streak })
  } catch (error) {
    console.error('Error calculating streak:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
