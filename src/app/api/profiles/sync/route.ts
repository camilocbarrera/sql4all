import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { profiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get country code from request body (optional)
    let countryCode: string | null = null
    try {
      const body = await request.json()
      countryCode = body.countryCode || null
    } catch {
      // No body provided, that's fine
    }

    // Build display name
    const firstName = user.firstName || ''
    const lastName = user.lastName || ''
    const displayName = `${firstName} ${lastName}`.trim() || 
      user.username || 
      user.emailAddresses[0]?.emailAddress?.split('@')[0] || 
      'Usuario'

    // Upsert profile
    const existingProfile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1)

    const profileData = {
      displayName,
      email: user.emailAddresses[0]?.emailAddress || null,
      imageUrl: user.imageUrl || null,
      updatedAt: new Date(),
      ...(countryCode && { countryCode }),
    }

    if (existingProfile.length > 0) {
      // Update existing profile
      await db
        .update(profiles)
        .set(profileData)
        .where(eq(profiles.id, userId))
    } else {
      // Create new profile
      await db.insert(profiles).values({
        id: userId,
        ...profileData,
        createdAt: new Date(),
      })
    }

    // Return updated profile
    const [updatedProfile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1)

    return NextResponse.json({ profile: updatedProfile })
  } catch (error) {
    console.error('Error syncing profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET current user's profile
export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1)

    if (!profile) {
      return NextResponse.json({ profile: null })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

