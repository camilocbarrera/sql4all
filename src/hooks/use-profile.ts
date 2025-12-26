'use client'

import { useQuery } from '@tanstack/react-query'
import { useUser } from '@clerk/nextjs'
import { queryKeys } from '@/lib/query-client'

interface HistoryItem {
  exerciseId: string
  exerciseTitle: string
  difficulty: string
  solvedAt: string
  score: number
}

async function fetchUserHistory(userId: string): Promise<HistoryItem[]> {
  const res = await fetch(`/api/users/${userId}/history`)
  if (!res.ok) {
    console.error('Failed to fetch history:', res.status, res.statusText)
    throw new Error('Failed to fetch history')
  }
  const data = await res.json()
  console.log('[useUserHistory] API response:', data)
  if (!data.history || !Array.isArray(data.history)) {
    console.warn('[useUserHistory] Invalid history data:', data)
    return []
  }
  return data.history
}

async function fetchHeatmapData(userId: string): Promise<string[]> {
  const res = await fetch(`/api/users/${userId}/heatmap`)
  if (!res.ok) {
    console.error('Failed to fetch heatmap data:', res.status, res.statusText)
    throw new Error('Failed to fetch heatmap data')
  }
  const data = await res.json()
  return data.dates || []
}

export function useUserHistory() {
  const { user } = useUser()
  const userId = user?.id

  return useQuery({
    queryKey: [...queryKeys.solvedExercises(userId ?? ''), 'history'],
    queryFn: () => fetchUserHistory(userId!),
    enabled: !!userId,
  })
}

export function useHeatmapData() {
  const { user } = useUser()
  const userId = user?.id

  return useQuery({
    queryKey: [...queryKeys.solvedExercises(userId ?? ''), 'heatmap'],
    queryFn: () => fetchHeatmapData(userId!),
    enabled: !!userId,
  })
}

