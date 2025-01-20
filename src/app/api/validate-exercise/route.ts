import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { query, exerciseId } = await request.json()

    if (!query || !exerciseId) {
      return NextResponse.json(
        { error: 'Query and exerciseId are required' },
        { status: 400 }
      )
    }

    // Get exercise data directly from Supabase
    const { data: exercise, error: exerciseError } = await supabase
      .from('exercises')
      .select('*')
      .eq('id', exerciseId)
      .eq('is_deleted', false)
      .single()

    if (exerciseError) {
      throw new Error('Failed to fetch exercise details')
    }

    // Return the exercise data to be validated client-side
    return NextResponse.json({
      exercise,
      query
    })

  } catch (error) {
    console.error('Error fetching exercise:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 