'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useUser } from '@clerk/nextjs'
import { ArrowLeft, Settings } from 'lucide-react'
import Link from 'next/link'
import {
  useUserScore,
  useUserStreak,
  useWeekProgress,
  useSolvedExercises,
} from '@/hooks/use-submissions'
import { useUserHistory } from '@/hooks/use-profile'
import { Button, Card, CardContent, Skeleton } from '@/components/ui'
import {
  UserAvatar,
  LevelBadge,
  StatsGrid,
  ExerciseHistory,
  ActivityHeatmap,
} from '@/components/profile'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const { data: score, isLoading: scoreLoading } = useUserScore()
  const { data: streak, isLoading: streakLoading } = useUserStreak()
  const { data: weekProgress, isLoading: weekLoading } = useWeekProgress()
  const { data: solvedExercises } = useSolvedExercises()
  const { data: history, isLoading: historyLoading } = useUserHistory()

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/')
    }
  }, [isLoaded, user, router])

  if (!isLoaded || !user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-8">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    )
  }

  const isLoading = scoreLoading || streakLoading || weekLoading

  const historyItems = (history || []).map((item) => ({
    ...item,
    solvedAt: new Date(item.solvedAt),
  }))

  // Get total exercises from a fetch (we'll use a rough estimate for now)
  const totalExercises = 15 // TODO: fetch from API

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://accounts.clerk.dev/user"
              target="_blank"
              rel="noopener noreferrer"
              title="Configuración de cuenta"
            >
              <Settings className="h-4 w-4" />
            </a>
          </Button>
        </div>

        {/* Profile Header */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <UserAvatar
                name={user.fullName || user.username}
                score={score || 0}
                size="xl"
              />
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold">
                  {user.fullName || user.username || 'Usuario'}
                </h1>
                <p className="text-muted-foreground mb-3">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
                <LevelBadge score={score || 0} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : (
          <StatsGrid
            score={score || 0}
            streak={streak || 0}
            totalSolved={solvedExercises?.size || 0}
            totalExercises={totalExercises}
          />
        )}

        {/* Activity & History */}
        <div className="grid gap-8 lg:grid-cols-2">
          {weekLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <ActivityHeatmap
              weekProgress={weekProgress || []}
              streak={streak || 0}
            />
          )}

          {historyLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <ExerciseHistory history={historyItems} />
          )}
        </div>
      </motion.div>
    </div>
  )
}

