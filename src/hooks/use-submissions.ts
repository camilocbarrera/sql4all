'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useUser } from '@clerk/nextjs'
import { queryKeys } from '@/lib/query-client'
import type { WeekProgress } from '@/lib/validations'

async function fetchUserScore(userId: string): Promise<number> {
  const res = await fetch(`/api/users/${userId}/score`)
  if (!res.ok) throw new Error('Failed to fetch score')
  const data = await res.json()
  return data.score
}

async function fetchUserStreak(userId: string): Promise<number> {
  const res = await fetch(`/api/users/${userId}/streak`)
  if (!res.ok) throw new Error('Failed to fetch streak')
  const data = await res.json()
  return data.streak
}

async function fetchWeekProgress(userId: string): Promise<WeekProgress[]> {
  const res = await fetch(`/api/users/${userId}/week-progress`)
  if (!res.ok) throw new Error('Failed to fetch week progress')
  const data = await res.json()
  return data.progress
}

async function fetchSolvedExercises(userId: string): Promise<Set<string>> {
  const res = await fetch(`/api/users/${userId}/solved-exercises`)
  if (!res.ok) throw new Error('Failed to fetch solved exercises')
  const data = await res.json()
  return new Set(data.exerciseIds)
}

interface CreateSubmissionParams {
  exerciseId: string
  solution?: string
}

async function createSubmission({ exerciseId, solution }: CreateSubmissionParams): Promise<void> {
  const res = await fetch('/api/submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ exerciseId, solution }),
  })
  if (!res.ok) throw new Error('Failed to create submission')
}

async function fetchSavedSolution(userId: string, exerciseId: string): Promise<string | null> {
  const res = await fetch(`/api/users/${userId}/solutions/${exerciseId}`)
  if (!res.ok) return null
  const data = await res.json()
  return data.solution
}

export function useUserScore() {
  const { user } = useUser()
  const userId = user?.id

  return useQuery({
    queryKey: queryKeys.userScore(userId ?? ''),
    queryFn: () => fetchUserScore(userId!),
    enabled: !!userId,
    initialData: 0,
  })
}

export function useUserStreak() {
  const { user } = useUser()
  const userId = user?.id

  return useQuery({
    queryKey: queryKeys.userStreak(userId ?? ''),
    queryFn: () => fetchUserStreak(userId!),
    enabled: !!userId,
    initialData: 0,
  })
}

export function useWeekProgress() {
  const { user } = useUser()
  const userId = user?.id

  return useQuery({
    queryKey: queryKeys.weekProgress(userId ?? ''),
    queryFn: () => fetchWeekProgress(userId!),
    enabled: !!userId,
    initialData: [],
  })
}

export function useSolvedExercises() {
  const { user } = useUser()
  const userId = user?.id

  return useQuery({
    queryKey: queryKeys.solvedExercises(userId ?? ''),
    queryFn: () => fetchSolvedExercises(userId!),
    enabled: !!userId,
    initialData: new Set<string>(),
  })
}

export function useSavedSolution(exerciseId: string) {
  const { user } = useUser()
  const userId = user?.id

  return useQuery({
    queryKey: ['savedSolution', userId, exerciseId],
    queryFn: () => fetchSavedSolution(userId!, exerciseId),
    enabled: !!userId && !!exerciseId,
  })
}

export function useCreateSubmission() {
  const { user } = useUser()
  const userId = user?.id
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSubmission,
    onMutate: async ({ exerciseId }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.userScore(userId ?? '') })
      await queryClient.cancelQueries({ queryKey: queryKeys.userStreak(userId ?? '') })
      await queryClient.cancelQueries({ queryKey: queryKeys.solvedExercises(userId ?? '') })

      const previousScore = queryClient.getQueryData<number>(queryKeys.userScore(userId ?? ''))
      const previousStreak = queryClient.getQueryData<number>(queryKeys.userStreak(userId ?? ''))
      const previousSolved = queryClient.getQueryData<Set<string>>(queryKeys.solvedExercises(userId ?? ''))

      // Optimistic updates
      queryClient.setQueryData<number>(queryKeys.userScore(userId ?? ''), (old) => (old ?? 0) + 2)
      queryClient.setQueryData<number>(queryKeys.userStreak(userId ?? ''), (old) => (old ?? 0) + 1)
      queryClient.setQueryData<Set<string>>(queryKeys.solvedExercises(userId ?? ''), (old) => {
        const newSet = new Set(old)
        newSet.add(exerciseId)
        return newSet
      })

      return { previousScore, previousStreak, previousSolved }
    },
    onError: (_err, _params, context) => {
      if (context?.previousScore !== undefined) {
        queryClient.setQueryData(queryKeys.userScore(userId ?? ''), context.previousScore)
      }
      if (context?.previousStreak !== undefined) {
        queryClient.setQueryData(queryKeys.userStreak(userId ?? ''), context.previousStreak)
      }
      if (context?.previousSolved !== undefined) {
        queryClient.setQueryData(queryKeys.solvedExercises(userId ?? ''), context.previousSolved)
      }
    },
    onSettled: (_data, _error, { exerciseId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userScore(userId ?? '') })
      queryClient.invalidateQueries({ queryKey: queryKeys.userStreak(userId ?? '') })
      queryClient.invalidateQueries({ queryKey: queryKeys.weekProgress(userId ?? '') })
      queryClient.invalidateQueries({ queryKey: queryKeys.solvedExercises(userId ?? '') })
      queryClient.invalidateQueries({ queryKey: ['savedSolution', userId, exerciseId] })
    },
  })
}
