'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Exercise } from '@/lib/validations'

type Difficulty = 'Principiante' | 'Intermedio' | 'Avanzado'

const difficultyVariants: Record<Difficulty, string> = {
  Principiante: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
  Intermedio: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:text-yellow-400',
  Avanzado: 'bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400',
}

interface ExerciseCardProps {
  exercise: Exercise
  isSolved?: boolean
}

export function ExerciseCard({ exercise, isSolved }: ExerciseCardProps) {
  const difficulty = exercise.difficulty as Difficulty

  return (
    <Link href={`/exercises/${exercise.id}`} className="block h-full">
      <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }} className="h-full">
        <Card
          className={cn(
            'h-full cursor-pointer transition-all duration-200 flex flex-col',
            'hover:shadow-lg hover:border-primary/50',
            'bg-card/80 backdrop-blur-sm',
            isSolved && 'border-emerald-500/30 bg-emerald-500/5'
          )}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-lg font-semibold line-clamp-2 leading-tight min-h-[3.5rem]">
                {exercise.title}
              </CardTitle>
              {isSolved && (
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              )}
            </div>
            <Badge
              variant="outline"
              className={cn('w-fit text-xs', difficultyVariants[difficulty])}
            >
              {difficulty}
            </Badge>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <p className="text-sm text-muted-foreground line-clamp-3 flex-1 min-h-[4.5rem]">
              {exercise.description}
            </p>
            <div className="flex items-center justify-end mt-4">
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  )
}

