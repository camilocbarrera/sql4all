'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { useUserScore } from '@/hooks/use-submissions'
import { Badge, Skeleton } from '@/components/ui'

export function ScoreBadge() {
  const { user } = useUser()
  const { data: score, isLoading } = useUserScore()

  if (!user) return null

  if (isLoading) {
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
              key={score}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">{score} pts</span>
            </motion.div>
          </AnimatePresence>
        </Badge>
      </motion.div>
    </Link>
  )
}

