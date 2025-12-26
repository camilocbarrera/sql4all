import { pgTable, uuid, text, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// User profiles - synced from Clerk
export const profiles = pgTable('profiles', {
  id: text('id').primaryKey(), // Clerk user ID
  displayName: text('display_name'),
  email: text('email'),
  imageUrl: text('image_url'),
  countryCode: text('country_code'), // ISO 3166-1 alpha-2 (e.g., 'CO', 'US')
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const exercises = pgTable('exercises', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  difficulty: text('difficulty').notNull(),
  description: text('description').notNull(),
  details: text('details').notNull(),
  hint: text('hint').notNull(),
  successMessage: text('success_message').notNull(),
  example: jsonb('example').notNull().$type<{ entrada?: string; salida?: string }>(),
  type: text('type').default('dml').notNull().$type<'dml' | 'ddl'>(),
  validation: jsonb('validation').notNull().$type<{
    type: 'exact' | 'partial' | 'ddl_schema'
    conditions: Record<string, unknown>
  }>(),
  isDeleted: boolean('is_deleted').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const submissions = pgTable('submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(), // Clerk user ID (not UUID)
  exerciseId: uuid('exercise_id').notNull().references(() => exercises.id, { onDelete: 'cascade' }),
  score: integer('score').default(2).notNull(),
  solution: text('solution'), // User's SQL solution
  feedback: text('feedback'),
  attempts: integer('attempts').default(1).notNull(),
  timeSpentSeconds: integer('time_spent_seconds'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Relations
export const profilesRelations = relations(profiles, ({ many }) => ({
  submissions: many(submissions),
}))

export const exercisesRelations = relations(exercises, ({ many }) => ({
  submissions: many(submissions),
}))

export const submissionsRelations = relations(submissions, ({ one }) => ({
  exercise: one(exercises, {
    fields: [submissions.exerciseId],
    references: [exercises.id],
  }),
  profile: one(profiles, {
    fields: [submissions.userId],
    references: [profiles.id],
  }),
}))
