'use client'

import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getTotalScore } from '@/lib/exercises-service'

export type ScoreBadgeRef = {
  updateScore: () => Promise<void>
}

export const ScoreBadge = forwardRef<ScoreBadgeRef>((_, ref) => {
  const { user } = useAuth()
  const [score, setScore] = useState<number>(0)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (user) {
      fetchScore()
    }
  }, [user])

  const fetchScore = async () => {
    if (!user) return
    const { data } = await getTotalScore(user.id)
    setScore(data)
  }

  const updateScore = async () => {
    setIsUpdating(true)
    await fetchScore()
    setTimeout(() => setIsUpdating(false), 1000)
  }

  useImperativeHandle(ref, () => ({
    updateScore
  }))

  if (!user) return null

  return (
    <motion.div
      className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full"
      whileHover={{ scale: 1.05 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={score}
          initial={{ scale: isUpdating ? 1.2 : 1, opacity: isUpdating ? 0 : 1 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="flex items-center gap-2"
        >
          <Trophy className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-medium">{score} pts</span>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
})

ScoreBadge.displayName = 'ScoreBadge'

// Create a singleton ref to store the score badge reference
let scoreBadgeRef: ScoreBadgeRef | null = null

export const setScoreBadgeRef = (ref: ScoreBadgeRef | null) => {
  scoreBadgeRef = ref
}

export const triggerScoreUpdate = () => {
  if (scoreBadgeRef) {
    scoreBadgeRef.updateScore()
  }
} 