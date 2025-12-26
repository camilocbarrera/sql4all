'use client'

import { useQuery } from '@tanstack/react-query'

interface LeaderboardEntry {
  userId: string
  displayName: string
  imageUrl: string | null
  countryCode: string | null
  totalScore: number
  exercisesSolved: number
  rank: number
}

interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[]
  updatedAt: string
}

async function fetchLeaderboard(): Promise<LeaderboardResponse> {
  const res = await fetch('/api/leaderboard')
  if (!res.ok) throw new Error('Failed to fetch leaderboard')
  return res.json()
}

export function useLeaderboard() {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: fetchLeaderboard,
    staleTime: 60 * 1000, // Consider data fresh for 1 minute
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}

