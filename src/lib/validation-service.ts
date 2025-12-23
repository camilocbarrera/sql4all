import type { ExpectedOutput } from '@/types/exercises'

interface QueryResult {
  rows: Record<string, unknown>[]
  fields: { name: string }[]
}

interface ValidationConfig {
  type: 'exact' | 'partial'
  conditions: Record<string, unknown>
}

export function validateQueryResult(
  result: QueryResult,
  expectedOutput: ValidationConfig | ExpectedOutput
): boolean {
  const { type, conditions } = expectedOutput

  switch (type) {
    case 'exact': {
      const conds = conditions as {
        rows?: number
        columns?: string[]
        values?: Record<string, unknown>[]
      }

      if (conds.rows !== undefined && result.rows.length !== conds.rows) {
        return false
      }

      if (conds.columns) {
        const hasAllColumns = conds.columns.every((col) =>
          result.fields.some((field) => field.name === col)
        )
        if (!hasAllColumns) return false
      }

      if (conds.values) {
        return conds.values.every((expectedRow, index) => {
          const actualRow = result.rows[index]
          if (!actualRow) return false
          return Object.entries(expectedRow).every(
            ([key, value]) => actualRow[key] === value
          )
        })
      }

      return true
    }

    case 'partial': {
      const conds = conditions as {
        columns?: string[]
        customValidation?: (result: QueryResult) => boolean
      }

      if (conds.columns) {
        const hasRequiredColumns = conds.columns.every((col) =>
          result.fields.some((field) => field.name === col)
        )
        if (!hasRequiredColumns) return false
      }

      if (conds.customValidation) {
        return conds.customValidation(result)
      }

      return true
    }

    default:
      return false
  }
}
