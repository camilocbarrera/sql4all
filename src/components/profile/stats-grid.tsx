'use client'

import { motion } from 'framer-motion'
import { Trophy, Flame, Target, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui'

interface StatsGridProps {
  score: number
  streak: number
  totalSolved: number
  totalExercises: number
}

export function StatsGrid({ score, streak, totalSolved, totalExercises }: StatsGridProps) {
  const completionRate = totalExercises > 0 ? Math.round((totalSolved / totalExercises) * 100) : 0

  const stats = [
    {
      label: 'Puntos Totales',
      value: score,
      icon: Trophy,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      label: 'Racha Actual',
      value: `${streak} días`,
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      label: 'Ejercicios Resueltos',
      value: totalSolved,
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Progreso Total',
      value: `${completionRate}%`,
      icon: Target,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-2xl font-bold truncate">{stat.value}</p>
                    <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

