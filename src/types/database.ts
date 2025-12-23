export interface SQLResult {
  rows: Record<string, unknown>[]
  fields: { name: string }[]
}
