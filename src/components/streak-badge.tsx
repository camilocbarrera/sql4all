'use client'

import { useEffect, useState, forwardRef, useImperativeHandle, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getStreak, getWeekProgress } from '@/lib/exercises-service'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export type StreakBadgeRef = {
  updateStreak: () => Promise<void>
}

export const StreakBadge = forwardRef<StreakBadgeRef>((_, ref) => {
  const { user } = useAuth()
  const [streak, setStreak] = useState<number>(0)
  const [weekProgress, setWeekProgress] = useState<any[]>([])
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchStreak = useCallback(async () => {
    if (!user) return
    const { data } = await getStreak(user.id)
    setStreak(data)
  }, [user])

  const fetchWeekProgress = useCallback(async () => {
    if (!user) return
    const { data } = await getWeekProgress(user.id)
    setWeekProgress(data)
  }, [user])

  useEffect(() => {
    if (user) {
      fetchStreak()
      fetchWeekProgress()
    }
  }, [user, fetchStreak, fetchWeekProgress])

  const updateStreak = async () => {
    setIsUpdating(true)
    await Promise.all([fetchStreak(), fetchWeekProgress()])
    setTimeout(() => setIsUpdating(false), 1000)
  }

  useImperativeHandle(ref, () => ({
    updateStreak
  }))

  if (!user) return null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={streak}
              initial={{ scale: isUpdating ? 1.2 : 1, opacity: isUpdating ? 0 : 1 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">{streak} días</span>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">¡Tu progreso diario! 🌟</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="text-center">
            <div className="text-3xl font-bold">{streak}</div>
            <div className="text-sm text-muted-foreground">días seguidos</div>
          </div>
          
          <div className="w-full grid grid-cols-7 gap-2">
            {weekProgress.map((day, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="text-xs text-muted-foreground mb-1">{day.day}</div>
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    day.completed 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {day.completed ? '✓' : '·'}
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground text-center mt-4">
            Completa ejercicios todos los días para mantener tu racha
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
})

StreakBadge.displayName = 'StreakBadge'

// Create a singleton ref to store the streak badge reference
let streakBadgeRef: StreakBadgeRef | null = null

export const setStreakBadgeRef = (ref: StreakBadgeRef | null) => {
  streakBadgeRef = ref
}

export const triggerStreakUpdate = () => {
  if (streakBadgeRef) {
    streakBadgeRef.updateStreak()
  }
} 