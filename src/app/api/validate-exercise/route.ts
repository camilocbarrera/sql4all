import { NextResponse } from 'next/server'
import { dbService } from '@/lib/db-service'

export async function POST(request: Request) {
  try {
    const { query } = await request.json()
    const result = await dbService.executeQuery(query)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: true, message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 