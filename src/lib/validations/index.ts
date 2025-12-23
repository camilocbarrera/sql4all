import { z } from 'zod'

export const exerciseExampleSchema = z.object({
  entrada: z.string().optional(),
  salida: z.string().optional(),
})

export const exerciseValidationSchema = z.object({
  type: z.enum(['exact', 'partial']),
  conditions: z.record(z.unknown()),
})

export const exerciseSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  difficulty: z.enum(['Principiante', 'Intermedio', 'Avanzado']),
  description: z.string().min(1),
  details: z.string().min(1),
  hint: z.string().min(1),
  successMessage: z.string().min(1),
  example: exerciseExampleSchema,
  validation: exerciseValidationSchema,
  isDeleted: z.boolean().default(false),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().nullable(),
  image: z.string().url().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const submissionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  exerciseId: z.string().uuid(),
  score: z.number().int().min(0),
  solution: z.string().nullable(),
  feedback: z.string().nullable(),
  attempts: z.number().int().min(1).default(1),
  timeSpentSeconds: z.number().int().nullable(),
  createdAt: z.coerce.date(),
})

export const createSubmissionSchema = z.object({
  exerciseId: z.string().uuid(),
  solution: z.string().optional(),
})

export const queryResultSchema = z.object({
  error: z.boolean(),
  message: z.string().optional(),
  example: z.string().optional(),
  rows: z.array(z.record(z.unknown())),
  fields: z.array(z.object({ name: z.string() })),
})

// API Response schemas
export const exercisesResponseSchema = z.object({
  exercises: z.array(exerciseSchema),
})

export const submissionResponseSchema = z.object({
  submission: submissionSchema,
})

export const scoreResponseSchema = z.object({
  score: z.number(),
})

export const streakResponseSchema = z.object({
  streak: z.number(),
})

export const weekProgressSchema = z.object({
  day: z.string(),
  completed: z.boolean(),
})

export const weekProgressResponseSchema = z.object({
  progress: z.array(weekProgressSchema),
})

export const solvedExercisesResponseSchema = z.object({
  exerciseIds: z.array(z.string().uuid()),
})

// Type exports
export type Exercise = z.infer<typeof exerciseSchema>
export type User = z.infer<typeof userSchema>
export type Submission = z.infer<typeof submissionSchema>
export type CreateSubmission = z.infer<typeof createSubmissionSchema>
export type QueryResult = z.infer<typeof queryResultSchema>
export type WeekProgress = z.infer<typeof weekProgressSchema>

