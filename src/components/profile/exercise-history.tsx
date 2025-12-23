'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle2, Clock, ArrowRight } from 'lucide-react'
import { formatDistanceToNow } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Button,
} from '@/components/ui'

interface HistoryItem {
  exerciseId: string
  exerciseTitle: string
  difficulty: string
  solvedAt: Date
  score: number
}

interface ExerciseHistoryProps {
  history: HistoryItem[]
}

const difficultyColors: Record<string, string> = {
  Principiante: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  Intermedio: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  Avanzado: 'bg-red-500/10 text-red-600 border-red-500/20',
}

export function ExerciseHistory({ history }: ExerciseHistoryProps) {
  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de Ejercicios</CardTitle>
          <CardDescription>Ejercicios que has completado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Aún no has completado ningún ejercicio
            </p>
            <Button asChild>
              <Link href="/">
                Empezar a practicar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Ejercicios</CardTitle>
        <CardDescription>
          {history.length} ejercicio{history.length !== 1 ? 's' : ''} completado{history.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {history.map((item, index) => (
            <motion.div
              key={`${item.exerciseId}-${item.solvedAt.toISOString()}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/exercises/${item.exerciseId}`}>
                <div className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors group">
                  <div className="shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate group-hover:text-primary transition-colors">
                      {item.exerciseTitle}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="outline"
                        className={`text-xs ${difficultyColors[item.difficulty] || ''}`}
                      >
                        {item.difficulty}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(item.solvedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 text-sm font-medium text-muted-foreground">
                    +{item.score} pts
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

