import { config } from 'dotenv'
config({ path: '.env.local' })

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { submissions } from '../src/lib/db/schema'
import { eq, desc, gte, and } from 'drizzle-orm'

const USER_ID = process.argv[2] || 'user_37PFmZhlxMbK0JtsR2qPHCMnFJK'

async function debugUserSubmissions() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error('DATABASE_URL environment variable is not set')
    process.exit(1)
  }

  console.log('='.repeat(60))
  console.log('DEBUG: User Submissions')
  console.log('='.repeat(60))
  console.log('User ID:', USER_ID)
  console.log('')

  const sql = neon(databaseUrl)
  const db = drizzle(sql)

  try {
    // Get all submissions for the user
    const allSubmissions = await db
      .select()
      .from(submissions)
      .where(eq(submissions.userId, USER_ID))
      .orderBy(desc(submissions.createdAt))

    console.log(`Total submissions found: ${allSubmissions.length}`)
    console.log('')

    if (allSubmissions.length === 0) {
      console.log('No submissions found for this user.')
      return
    }

    // Show last 10 submissions
    console.log('Last 10 submissions:')
    console.log('-'.repeat(60))
    
    const recent = allSubmissions.slice(0, 10)
    for (const sub of recent) {
      console.log(`  ID: ${sub.id}`)
      console.log(`  Created At: ${sub.createdAt.toISOString()}`)
      console.log(`  Local Time: ${sub.createdAt.toLocaleString()}`)
      console.log(`  Exercise ID: ${sub.exerciseId}`)
      console.log(`  Score: ${sub.score}`)
      console.log('-'.repeat(60))
    }

    // Check submissions for current year (heatmap logic)
    const currentYear = new Date().getFullYear()
    const startOfYear = new Date(currentYear, 0, 1)
    
    console.log('')
    console.log('Heatmap Query Check:')
    console.log(`  Current Year: ${currentYear}`)
    console.log(`  Start of Year: ${startOfYear.toISOString()}`)
    
    const heatmapSubmissions = await db
      .select({ createdAt: submissions.createdAt })
      .from(submissions)
      .where(
        and(
          eq(submissions.userId, USER_ID),
          gte(submissions.createdAt, startOfYear)
        )
      )

    console.log(`  Submissions in ${currentYear}: ${heatmapSubmissions.length}`)
    console.log('')

    // Check today's submissions
    const today = new Date()
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

    console.log('Today Check:')
    console.log(`  Today (UTC): ${today.toISOString()}`)
    console.log(`  Start of Today: ${startOfToday.toISOString()}`)
    console.log(`  End of Today: ${endOfToday.toISOString()}`)

    const todaySubmissions = allSubmissions.filter(sub => {
      const subDate = new Date(sub.createdAt)
      return subDate >= startOfToday && subDate < endOfToday
    })

    console.log(`  Submissions today: ${todaySubmissions.length}`)
    
    if (todaySubmissions.length > 0) {
      console.log('')
      console.log('Today\'s submissions:')
      for (const sub of todaySubmissions) {
        console.log(`    - ${sub.createdAt.toISOString()} | Exercise: ${sub.exerciseId} | Score: ${sub.score}`)
      }
    }

    // Group by date for heatmap visualization
    console.log('')
    console.log('Submissions by date (last 7 days):')
    const dateCounts: Record<string, number> = {}
    
    for (const sub of allSubmissions) {
      const dateKey = sub.createdAt.toISOString().split('T')[0]
      dateCounts[dateKey] = (dateCounts[dateKey] || 0) + 1
    }

    const sortedDates = Object.entries(dateCounts)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, 7)

    for (const [date, count] of sortedDates) {
      console.log(`  ${date}: ${count} submissions`)
    }

  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

debugUserSubmissions()

