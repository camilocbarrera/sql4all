import { db } from '@/lib/db'
import { exercises } from '@/lib/db/schema'
import { eq, and, asc } from 'drizzle-orm'
import type { Exercise } from '@/lib/validations'

const difficultyOrder = ['Principiante', 'Intermedio', 'Avanzado'] as const

function mapExercise(ex: typeof exercises.$inferSelect): Exercise {
  return {
    id: ex.id,
    title: ex.title,
    difficulty: ex.difficulty as Exercise['difficulty'],
    description: ex.description,
    details: ex.details,
    hint: ex.hint,
    successMessage: ex.successMessage,
    example: ex.example as Exercise['example'],
    validation: ex.validation as Exercise['validation'],
    isDeleted: ex.isDeleted,
    createdAt: ex.createdAt,
    updatedAt: ex.updatedAt,
  }
}

export async function getExercises(): Promise<Exercise[]> {
  const data = await db
    .select()
    .from(exercises)
    .where(eq(exercises.isDeleted, false))
    .orderBy(asc(exercises.createdAt))

  return data.map(mapExercise)
}

export async function getExerciseById(id: string): Promise<Exercise | null> {
  const [exercise] = await db
    .select()
    .from(exercises)
    .where(and(eq(exercises.id, id), eq(exercises.isDeleted, false)))
    .limit(1)

  if (!exercise) return null
  return mapExercise(exercise)
}

interface ExerciseContext {
  nextExercise: Exercise | null
  prevExercise: Exercise | null
  currentIndex: number
  totalExercises: number
}

export async function getExerciseContext(currentExerciseId: string): Promise<ExerciseContext | null> {
  const currentExercise = await getExerciseById(currentExerciseId)
  if (!currentExercise) return null

  const allExercises = await getExercises()
  const flatIndex = allExercises.findIndex((ex) => ex.id === currentExerciseId)

  const groupedExercises = allExercises.reduce<Record<string, Exercise[]>>((acc, ex) => {
    if (!acc[ex.difficulty]) {
      acc[ex.difficulty] = []
    }
    acc[ex.difficulty].push(ex)
    return acc
  }, {})

  const currentDifficultyExercises = groupedExercises[currentExercise.difficulty] || []
  const currentIndex = currentDifficultyExercises.findIndex((ex) => ex.id === currentExerciseId)

  let nextExercise: Exercise | null = null
  let prevExercise: Exercise | null = null

  // Previous in same difficulty
  if (currentIndex > 0) {
    prevExercise = currentDifficultyExercises[currentIndex - 1]
  } else {
    // Move to previous difficulty
    const currentDifficultyIndex = difficultyOrder.indexOf(
      currentExercise.difficulty as (typeof difficultyOrder)[number]
    )
    if (currentDifficultyIndex > 0) {
      const prevDifficulty = difficultyOrder[currentDifficultyIndex - 1]
      const prevDifficultyExercises = groupedExercises[prevDifficulty] || []
      if (prevDifficultyExercises.length > 0) {
        prevExercise = prevDifficultyExercises[prevDifficultyExercises.length - 1]
      }
    }
  }

  // Next in same difficulty
  if (currentIndex < currentDifficultyExercises.length - 1) {
    nextExercise = currentDifficultyExercises[currentIndex + 1]
  } else {
    // Move to next difficulty
    const currentDifficultyIndex = difficultyOrder.indexOf(
      currentExercise.difficulty as (typeof difficultyOrder)[number]
    )
    if (currentDifficultyIndex < difficultyOrder.length - 1) {
      const nextDifficulty = difficultyOrder[currentDifficultyIndex + 1]
      const nextDifficultyExercises = groupedExercises[nextDifficulty] || []
      if (nextDifficultyExercises.length > 0) {
        nextExercise = nextDifficultyExercises[0]
      }
    }
  }

  return {
    nextExercise,
    prevExercise,
    currentIndex: flatIndex,
    totalExercises: allExercises.length,
  }
}

export async function getNextExercise(currentExerciseId: string): Promise<Exercise | null> {
  const context = await getExerciseContext(currentExerciseId)
  return context?.nextExercise ?? null
}
