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
  if (!res.ok) throw new Error('Failed to fetch history')
  const data = await res.json()
  return data.history
}

export function useUserHistory() {
  const { user } = useUser()
  const userId = user?.id

  return useQuery({
    queryKey: [...queryKeys.solvedExercises(userId ?? ''), 'history'],
    queryFn: () => fetchUserHistory(userId!),
    enabled: !!userId,
    initialData: [],
  })
}

