import { NextRequest, NextResponse } from 'next/server'
import { getExercises } from '@/lib/exercises-service'
import { validateQueryResult } from '@/lib/validation-service'

export async function POST(request: NextRequest) {
  // Validate that the request is coming from our application
  const referer = request.headers.get('referer')
  if (!referer?.includes(process.env.NEXT_PUBLIC_APP_URL || '')) {
    return new NextResponse(
      JSON.stringify({ error: true, message: 'Unauthorized' }),
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { query, exerciseId } = body

    if (!query || !exerciseId) {
      return new NextResponse(
        JSON.stringify({ error: true, message: 'Missing required fields' }),
        { status: 400 }
      )
    }

    // Get the exercise
    const exercises = await getExercises()
    const exercise = exercises.find((e: any) => e.id === exerciseId)

    if (!exercise) {
      return new NextResponse(
        JSON.stringify({ error: true, message: 'Exercise not found' }),
        { status: 404 }
      )
    }

    // Return the query and exercise for client-side validation
    return new NextResponse(
      JSON.stringify({
        query,
        exercise,
        validation: exercise.validation,
        success_message: exercise.success_message
      }),
      { status: 200 }
    )

  } catch (error) {
    console.error('Error validating exercise:', error)
    return new NextResponse(
      JSON.stringify({ error: true, message: 'Internal server error' }),
      { status: 500 }
    )
  }
} 