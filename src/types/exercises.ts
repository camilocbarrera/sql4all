import type { QueryResult } from '@/lib/validations'

export type { QueryResult }

export interface ExpectedOutput {
  type: 'exact' | 'partial' | 'count' | 'custom'
  conditions: {
    rows?: number
    columns?: string[]
    values?: Record<string, unknown>[]
    customValidation?: (result: QueryResult) => boolean
  }
}
