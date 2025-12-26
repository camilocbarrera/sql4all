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
    <Link href={`/exercises/${exercise.id}`} className="block h-full group">
      <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.15 }} className="h-full">
        <Card
          className={cn(
            'h-full cursor-pointer transition-all duration-200',
            'hover:shadow-md hover:border-primary/50',
            'bg-card/80 backdrop-blur-sm',
            isSolved && 'border-emerald-500/30 bg-emerald-500/5'
          )}
        >
          <CardHeader className="p-4 pb-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Badge
                  variant="outline"
                  className={cn('shrink-0 text-[10px] px-1.5 py-0', difficultyVariants[difficulty])}
                >
                  {difficulty.slice(0, 3)}
                </Badge>
                <CardTitle className="text-sm font-medium line-clamp-1 leading-tight">
                  {exercise.title}
                </CardTitle>
              </div>
              {isSolved && (
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-xs text-muted-foreground line-clamp-2">
              {exercise.description}
            </p>
            <div className="flex items-center justify-end mt-2">
              <ArrowRight className="h-3 w-3 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  )
}

