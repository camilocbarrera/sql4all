import { supabase } from './supabase'

export type Exercise = {
  id: string
  title: string
  difficulty: string
  description: string
  details: string
  hint: string
  success_message: string
  example: {
    entrada?: string
    salida?: string
  }
  validation: {
    type: 'exact' | 'partial'
    conditions: any
  }
  created_at?: string
  updated_at?: string
}

export async function getExercises() {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('is_deleted', false)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching exercises:', error)
    throw error
  }

  return data as Exercise[]
}

export async function getExerciseById(id: string) {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('id', id)
    .eq('is_deleted', false)
    .single()

  if (error) {
    console.error('Error fetching exercise:', error)
    throw error
  }

  return data as Exercise
} 