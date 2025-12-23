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
      .select({ exerciseId: submissions.exerciseId })
      .from(submissions)
      .where(eq(submissions.userId, userId))

    const exerciseIds = [...new Set(userSubmissions.map((sub) => sub.exerciseId))]

    return NextResponse.json({ exerciseIds })
  } catch (error) {
    console.error('Error fetching solved exercises:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
