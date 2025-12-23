'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  name?: string | null
  score: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

// Level tiers based on score
const getLevelTier = (score: number) => {
  if (score >= 100) return { tier: 'Maestro', color: 'from-purple-500 to-pink-500', emoji: '👑' }
  if (score >= 50) return { tier: 'Experto', color: 'from-yellow-500 to-orange-500', emoji: '⚡' }
  if (score >= 20) return { tier: 'Intermedio', color: 'from-blue-500 to-cyan-500', emoji: '🚀' }
  return { tier: 'Principiante', color: 'from-emerald-500 to-teal-500', emoji: '🌱' }
}

const getInitials = (name?: string | null) => {
  if (!name) return '??'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-12 w-12 text-sm',
  lg: 'h-16 w-16 text-lg',
  xl: 'h-24 w-24 text-2xl',
}

export function UserAvatar({ name, score, size = 'md', className }: UserAvatarProps) {
  const { tier, color } = useMemo(() => getLevelTier(score), [score])
  const initials = useMemo(() => getInitials(name), [name])

  return (
    <div
      className={cn(
        'relative rounded-full bg-gradient-to-br font-bold text-white flex items-center justify-center',
        color,
        sizeClasses[size],
        className
      )}
      title={`${name || 'Usuario'} - ${tier}`}
    >
      {initials}
    </div>
  )
}

export function LevelBadge({ score, showEmoji = true }: { score: number; showEmoji?: boolean }) {
  const { tier, color, emoji } = useMemo(() => getLevelTier(score), [score])

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r',
        color
      )}
    >
      {showEmoji && <span>{emoji}</span>}
      {tier}
    </span>
  )
}

export { getLevelTier }

