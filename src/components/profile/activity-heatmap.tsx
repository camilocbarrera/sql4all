'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import { cn } from '@/lib/utils'

interface WeekDay {
  day: string
  completed: boolean
}

interface ActivityHeatmapProps {
  weekProgress: WeekDay[]
  streak: number
}

export function ActivityHeatmap({ weekProgress, streak }: ActivityHeatmapProps) {
  const completedDays = useMemo(
    () => weekProgress.filter((d) => d.completed).length,
    [weekProgress]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Actividad Semanal</span>
          <span className="text-sm font-normal text-muted-foreground">
            {completedDays}/7 días
          </span>
        </CardTitle>
        <CardDescription>
          Mantén tu racha completando ejercicios cada día
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {weekProgress.map((day, index) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col items-center gap-1.5"
            >
              <span className="text-xs text-muted-foreground font-medium">
                {day.day}
              </span>
              <div
                className={cn(
                  'w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors',
                  day.completed
                    ? 'bg-emerald-500 text-white'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {day.completed ? '✓' : '·'}
              </div>
            </motion.div>
          ))}
        </div>

        {streak > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="font-semibold text-orange-600 dark:text-orange-400">
                  ¡{streak} días de racha!
                </p>
                <p className="text-sm text-muted-foreground">
                  Sigue así para mantener tu racha
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

