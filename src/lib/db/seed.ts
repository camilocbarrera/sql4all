import { config } from 'dotenv'

config({ path: '.env.local' })
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { exercises } from './schema'
import { exercisesData } from './seed-data'

async function seed() {
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is not set')
    console.error('   Make sure you have a .env.local file with DATABASE_URL')
    process.exit(1)
  }

  console.log('🌱 Starting database seed...')
  
  const sql = neon(databaseUrl)
  const db = drizzle(sql)

  try {
    // Clear existing exercises (optional - comment out to keep existing)
    console.log('🗑️  Clearing existing exercises...')
    await db.delete(exercises)

    // Insert new exercises
    console.log('📝 Inserting exercises...')
    
    for (const exercise of exercisesData) {
      await db.insert(exercises).values({
        title: exercise.title,
        difficulty: exercise.difficulty,
        description: exercise.description,
        details: exercise.details,
        hint: exercise.hint,
        successMessage: exercise.successMessage,
        example: exercise.example,
        validation: exercise.validation,
      })
      console.log(`  ✓ Added: ${exercise.title}`)
    }

    console.log(`\n✅ Successfully seeded ${exercisesData.length} exercises!`)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seed()

