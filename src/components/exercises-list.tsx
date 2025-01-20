'use client'

import { useEffect, useState } from 'react'
import { Exercise, getExercises } from '@/lib/exercises-service'
import { Card } from './ui/card'
import { Badge } from './ui/badge'

const difficultyColors = {
  'Principiante': 'bg-green-500',
  'Intermedio': 'bg-yellow-500',
  'Avanzado': 'bg-red-500',
}

export function ExercisesList() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadExercises() {
      try {
        const data = await getExercises()
        setExercises(data)
      } catch (error) {
        console.error('Error loading exercises:', error)
      } finally {
        setLoading(false)
      }
    }

    loadExercises()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {exercises.map((exercise) => (
        <Card
          key={exercise.id}
          className="p-4 bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
          onClick={() => {
            // TODO: Implement exercise selection
            console.log('Selected exercise:', exercise.id)
          }}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-white">{exercise.title}</h3>
            <Badge className={difficultyColors[exercise.difficulty as keyof typeof difficultyColors]}>
              {exercise.difficulty}
            </Badge>
          </div>
          <p className="text-gray-400 text-sm mb-4">{exercise.description}</p>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>ID: {exercise.id.slice(0, 8)}...</span>
            <span>{new Date(exercise.created_at!).toLocaleDateString()}</span>
          </div>
        </Card>
      ))}
    </div>
  )
} 