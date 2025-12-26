'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Filter } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { useSolvedExercises } from '@/hooks/use-submissions'
import { Button, Badge } from '@/components/ui'
import { ExerciseCard } from './exercise-card'
import { cn } from '@/lib/utils'
import type { Exercise } from '@/lib/validations'

type Difficulty = 'Principiante' | 'Intermedio' | 'Avanzado'

const difficultyOrder: Difficulty[] = ['Principiante', 'Intermedio', 'Avanzado']

const difficultyIcons: Record<Difficulty, string> = {
  Principiante: '🌱',
  Intermedio: '🚀',
  Avanzado: '⚡',
}

interface ExerciseGridProps {
  exercises: Exercise[]
}

export function ExerciseGrid({ exercises }: ExerciseGridProps) {
  const { user } = useUser()
  const { data: solvedExercises } = useSolvedExercises()
  const [showOnlyUnsolved, setShowOnlyUnsolved] = useState(false)

  const filteredExercises = showOnlyUnsolved
    ? exercises.filter((ex) => !solvedExercises?.has(ex.id))
    : exercises

  const groupedExercises = filteredExercises.reduce<Record<string, Exercise[]>>(
    (acc, exercise) => {
      if (!acc[exercise.difficulty]) {
        acc[exercise.difficulty] = []
      }
      acc[exercise.difficulty].push(exercise)
      return acc
    },
    {}
  )

  return (
    <div className="space-y-10">
      {user && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowOnlyUnsolved(!showOnlyUnsolved)}
            className={cn(
              'gap-2',
              showOnlyUnsolved && 'bg-primary/10 border-primary/50'
            )}
          >
            <Filter className="h-4 w-4" />
            {showOnlyUnsolved ? 'Sin resolver' : 'Todos'}
          </Button>
        </div>
      )}

      {difficultyOrder.map(
        (difficulty) =>
          groupedExercises[difficulty] && (
            <motion.section
              key={difficulty}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{difficultyIcons[difficulty]}</span>
                <h2 className="text-xl font-semibold">{difficulty}</h2>
                <Badge variant="secondary">
                  {groupedExercises[difficulty].length} ejercicios
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedExercises[difficulty].map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    isSolved={solvedExercises?.has(exercise.id)}
                  />
                ))}
              </div>
            </motion.section>
          )
      )}
    </div>
  )
}


