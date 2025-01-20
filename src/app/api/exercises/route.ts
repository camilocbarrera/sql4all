import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')  // Get all fields since we'll need them for exercise selection
      .eq('is_deleted', false)
      .order('created_at', { ascending: true })

    if (error) throw error

    return NextResponse.json({
      exercises: data
    })
  } catch (error) {
    console.error('Error fetching exercises:', error)
    return NextResponse.json(
      { error: 'Error fetching exercises' },
      { status: 500 }
    )
  }
}

// Remove the POST endpoint since we won't need it anymore 