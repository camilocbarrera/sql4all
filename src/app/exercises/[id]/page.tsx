import { getExercises } from '@/lib/exercises-service'
import { ExerciseView } from '@/components/exercise-view'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const exercises = await getExercises()
  const exercise = exercises.find((e: any) => e.id === id)

  return {
    title: exercise ? `${exercise.title} - SQL4All` : 'Exercise Not Found - SQL4All'
  }
}

export async function generateStaticParams() {
  const exercises = await getExercises()
  return exercises.map((exercise: any) => ({
    id: exercise.id,
  }))
}

async function getExerciseById(id: string) {
  const exercises = await getExercises()
  const currentIndex = exercises.findIndex((e: any) => e.id === id)
  const exercise = exercises[currentIndex]
  const nextExercise = exercises[currentIndex + 1]
  
  return {
    exercise,
    nextExerciseId: nextExercise?.id
  }
}

export default async function ExercisePage({ params }: PageProps) {
  const { id } = await params
  const { exercise, nextExerciseId } = await getExerciseById(id)

  if (!exercise) {
    notFound()
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExerciseView exercise={exercise} nextExerciseId={nextExerciseId} />
    </Suspense>
  )
} 