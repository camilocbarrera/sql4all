export interface SQLResult {
  rows: Record<string, unknown>[];
  fields: { name: string }[];
  error?: boolean;
  message?: string;
  example?: string;
}

export interface TableField {
  name: string;
  type: string;
}

export interface SQLError {
  message: string;
  code?: string;
  stack?: string;
}

export interface DatabaseRow {
  [key: string]: unknown;
}

export interface CompletionSuggestion {
  label: string;
  kind: number;
  insertText: string;
  detail?: string;
  documentation?: string;
}


export interface Submission {
  id: string;
  exercise_id: string;
  score: number;
  feedback?: string | null;
  created_at: string;
  user_id: string;
}
