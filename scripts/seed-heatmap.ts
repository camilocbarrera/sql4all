import { config } from 'dotenv'
config({ path: '.env.local' })

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { submissions, exercises } from '../src/lib/db/schema'

const USER_ID = 'user_37N3N55IddhoQXNefDjKozEmAZ6'

async function seedHeatmapData() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is not set')
    console.error('   Make sure you have a .env.local file with DATABASE_URL')
    process.exit(1)
  }

  console.log('🌱 Seeding heatmap data for user:', USER_ID)

  const sql = neon(databaseUrl)
  const db = drizzle(sql)

  try {
    // Get existing exercises
    const existingExercises = await db.select({ id: exercises.id }).from(exercises)
    
    if (existingExercises.length === 0) {
      console.error('❌ No exercises found. Run db:seed first.')
      process.exit(1)
    }

    console.log(`📚 Found ${existingExercises.length} exercises`)
    const exerciseIds = existingExercises.map(e => e.id)

    // Generate random submissions across 2025
    const submissionsToInsert: {
      userId: string
      exerciseId: string
      score: number
      solution: string
      attempts: number
      createdAt: Date
    }[] = []

    const year = 2025
    
    // Create varied activity patterns
    const activityPatterns = [
      // January - moderate activity
      { month: 0, daysActive: 12, maxPerDay: 3 },
      // February - high activity
      { month: 1, daysActive: 18, maxPerDay: 4 },
      // March - low activity
      { month: 2, daysActive: 8, maxPerDay: 2 },
      // April - moderate
      { month: 3, daysActive: 14, maxPerDay: 3 },
      // May - high
      { month: 4, daysActive: 20, maxPerDay: 5 },
      // June - very high
      { month: 5, daysActive: 22, maxPerDay: 6 },
      // July - moderate
      { month: 6, daysActive: 15, maxPerDay: 3 },
      // August - low
      { month: 7, daysActive: 10, maxPerDay: 2 },
      // September - high
      { month: 8, daysActive: 18, maxPerDay: 4 },
      // October - very high
      { month: 9, daysActive: 24, maxPerDay: 5 },
      // November - moderate
      { month: 10, daysActive: 16, maxPerDay: 3 },
      // December (up to today) - high activity streak
      { month: 11, daysActive: 20, maxPerDay: 4 },
    ]

    const today = new Date()

    for (const pattern of activityPatterns) {
      const daysInMonth = new Date(year, pattern.month + 1, 0).getDate()
      const activeDays = new Set<number>()

      // Pick random days to be active
      while (activeDays.size < pattern.daysActive && activeDays.size < daysInMonth) {
        const day = Math.floor(Math.random() * daysInMonth) + 1
        const date = new Date(year, pattern.month, day)
        
        // Don't add future dates
        if (date <= today) {
          activeDays.add(day)
        }
      }

      // Create submissions for each active day
      for (const day of activeDays) {
        const submissionsCount = Math.floor(Math.random() * pattern.maxPerDay) + 1
        
        for (let i = 0; i < submissionsCount; i++) {
          const exerciseId = exerciseIds[Math.floor(Math.random() * exerciseIds.length)]
          const hour = Math.floor(Math.random() * 14) + 8 // 8am - 10pm
          const minute = Math.floor(Math.random() * 60)
          
          const createdAt = new Date(year, pattern.month, day, hour, minute)
          
          submissionsToInsert.push({
            userId: USER_ID,
            exerciseId,
            score: Math.random() > 0.3 ? 2 : 1, // 70% get full score
            solution: 'SELECT * FROM seeded_data;',
            attempts: Math.floor(Math.random() * 3) + 1,
            createdAt,
          })
        }
      }
    }

    // Add a streak for the last 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      if (date.getFullYear() === year) {
        const exerciseId = exerciseIds[Math.floor(Math.random() * exerciseIds.length)]
        submissionsToInsert.push({
          userId: USER_ID,
          exerciseId,
          score: 2,
          solution: 'SELECT * FROM streak_data;',
          attempts: 1,
          createdAt: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 14, 30),
        })
      }
    }

    console.log(`📝 Inserting ${submissionsToInsert.length} submissions...`)

    // Insert in batches
    const batchSize = 50
    for (let i = 0; i < submissionsToInsert.length; i += batchSize) {
      const batch = submissionsToInsert.slice(i, i + batchSize)
      await db.insert(submissions).values(batch)
      console.log(`  ✓ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(submissionsToInsert.length / batchSize)}`)
    }

    console.log(`\n✅ Successfully seeded ${submissionsToInsert.length} submissions for heatmap!`)
    
    // Summary by month
    const monthCounts: Record<number, number> = {}
    for (const sub of submissionsToInsert) {
      const month = sub.createdAt.getMonth()
      monthCounts[month] = (monthCounts[month] || 0) + 1
    }
    
    console.log('\n📊 Summary by month:')
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    for (const [month, count] of Object.entries(monthCounts).sort((a, b) => Number(a[0]) - Number(b[0]))) {
      console.log(`   ${monthNames[Number(month)]}: ${count} submissions`)
    }

  } catch (error) {
    console.error('❌ Error seeding heatmap data:', error)
    process.exit(1)
  }
}

seedHeatmapData()

