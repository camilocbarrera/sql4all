'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { useUserStreak } from '@/hooks/use-submissions'
import { Badge, Skeleton } from '@/components/ui'

export function StreakBadge() {
  const { user } = useUser()
  const { data: streak, isLoading: streakLoading } = useUserStreak()

  if (!user) return null

  if (streakLoading) {
    return <Skeleton className="h-7 w-20 rounded-full" />
  }

  return (
    <Link href="/profile">
      <motion.div whileHover={{ scale: 1.05 }}>
        <Badge 
          variant="secondary" 
          className="gap-2 px-3 py-1.5 cursor-pointer hover:bg-secondary/80 transition-colors"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={streak}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="font-medium">{streak} días</span>
            </motion.div>
          </AnimatePresence>
        </Badge>
      </motion.div>
    </Link>
  )
}

