import { NextRequest, NextResponse } from 'next/server'
import { getExercises } from '@/lib/exercises-service'

export async function GET(request: NextRequest) {
  // Validate that the request is coming from our application
  const referer = request.headers.get('referer')
  if (!referer?.includes(process.env.NEXT_PUBLIC_APP_URL || '')) {
    return new NextResponse(
      JSON.stringify({ error: true, message: 'Unauthorized' }),
      { status: 401 }
    )
  }

  try {
    const exercises = await getExercises()
    return new NextResponse(
      JSON.stringify({ exercises }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching exercises:', error)
    return new NextResponse(
      JSON.stringify({ error: true, message: 'Internal server error' }),
      { status: 500 }
    )
  }
}

// Remove the POST endpoint since we won't need it anymore 