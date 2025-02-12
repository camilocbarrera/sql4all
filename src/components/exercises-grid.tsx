'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from "@/lib/utils"

type Difficulty = 'Principiante' | 'Intermedio' | 'Avanzado';

const difficultyOrder: Difficulty[] = ['Principiante', 'Intermedio', 'Avanzado'];

const difficultyColors: Record<Difficulty, string> = {
  'Principiante': 'dark:bg-emerald-500/20 dark:text-emerald-500 dark:border-emerald-500/20 bg-emerald-100 text-emerald-700 border-emerald-200',
  'Intermedio': 'dark:bg-yellow-500/20 dark:text-yellow-500 dark:border-yellow-500/20 bg-yellow-100 text-yellow-700 border-yellow-200',
  'Avanzado': 'dark:bg-red-500/20 dark:text-red-500 dark:border-red-500/20 bg-red-100 text-red-700 border-red-200',
};

const difficultyIcons: Record<Difficulty, string> = {
  'Principiante': '🌱',
  'Intermedio': '🚀',
  'Avanzado': '⚡',
};

interface ExercisesGridProps {
  exercises: any[]
}

export function ExercisesGrid({ exercises }: ExercisesGridProps) {
  const groupedExercises = exercises.reduce((acc: any, exercise: any) => {
    if (!acc[exercise.difficulty]) {
      acc[exercise.difficulty] = [];
    }
    acc[exercise.difficulty].push(exercise);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {difficultyOrder.map((difficulty) => (
        groupedExercises[difficulty] && (
          <motion.div
            key={difficulty}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{difficultyIcons[difficulty]}</span>
                <h2 className="text-xl font-semibold dark:text-white text-gray-900">
                  {difficulty}
                </h2>
                <div className={`px-2 py-1 rounded-full text-xs ${difficultyColors[difficulty]}`}>
                  {groupedExercises[difficulty].length} ejercicios
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedExercises[difficulty].map((ejercicio: any) => (
                <Link href={`/exercises/${ejercicio.id}`} key={ejercicio.id}>
                  <Card 
                    className={cn(
                      "cursor-pointer transform transition-all duration-200 hover:scale-[1.02]",
                      "border-border/50 hover:border-primary/50",
                      "dark:bg-card/95 bg-white/90 backdrop-blur-sm shadow-md hover:shadow-xl",
                      "dark:hover:bg-accent/50 hover:bg-gray-50/80 h-full"
                    )}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2 dark:text-white text-gray-900">
                            {ejercicio.title}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="dark:text-gray-400 text-gray-600 text-sm line-clamp-3 mb-4">
                        {ejercicio.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-xs dark:text-gray-500 text-gray-600">
                            ID: {ejercicio.id.slice(0, 4)}
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 dark:text-gray-500 text-gray-600 transition-transform duration-200 group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>
        )
      ))}
    </div>
  )
} 