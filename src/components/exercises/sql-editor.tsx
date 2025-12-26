'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import Editor from '@monaco-editor/react'
import { format } from 'sql-formatter'
import { Play, FileCode, CheckCircle2, Loader2 } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import type * as Monaco from 'monaco-editor'
import type { editor } from 'monaco-editor'
import { Button, Card, CardContent } from '@/components/ui'
import { ErrorMessage } from '@/components/shared/error-message'
import { SignupPromptModal } from '@/components/shared/signup-prompt-modal'
import { useCreateSubmission, useSolvedExercises } from '@/hooks/use-submissions'
import { cn } from '@/lib/utils'

const LOCAL_COMPLETED_KEY = 'sql4all_completed_exercises'
const SIGNUP_DISMISSED_KEY = 'sql4all_signup_dismissed'

function getLocalCompletedExercises(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(LOCAL_COMPLETED_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function addLocalCompletedExercise(exerciseId: string): string[] {
  const completed = getLocalCompletedExercises()
  if (!completed.includes(exerciseId)) {
    completed.push(exerciseId)
    localStorage.setItem(LOCAL_COMPLETED_KEY, JSON.stringify(completed))
  }
  return completed
}

function isSignupDismissed(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(SIGNUP_DISMISSED_KEY) === 'true'
}

function dismissSignup(): void {
  localStorage.setItem(SIGNUP_DISMISSED_KEY, 'true')
}

interface ExerciseContext {
  title: string
  description: string
  details: string
  hint: string
  type?: 'dml' | 'ddl'
}

interface SqlEditorProps {
  value: string
  onChange: (value: string) => void
  onExecute: () => void
  onSaveSuccess?: () => void
  isLoading?: boolean
  error?: string | null
  errorTimestamp?: number
  errorExample?: string | null
  exerciseId?: string
  exercise?: ExerciseContext
  nextExerciseId?: string
  isValidated?: boolean
  isDDL?: boolean
}

const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP',
  'TABLE', 'DATABASE', 'ALTER', 'INDEX', 'GROUP BY', 'ORDER BY', 'HAVING',
  'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'UNION',
  'VALUES', 'INTO', 'SET', 'NULL', 'NOT NULL', 'PRIMARY KEY', 'FOREIGN KEY',
  'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'DISTINCT', 'AS', 'AND', 'OR', 'IN',
  'BETWEEN', 'LIKE', 'IS', 'ASC', 'DESC', 'ON', 'LIMIT',
]

const DDL_KEYWORDS = [
  'CREATE TABLE', 'DROP TABLE', 'ALTER TABLE', 'CREATE INDEX', 'DROP INDEX',
  'ADD COLUMN', 'DROP COLUMN', 'RENAME COLUMN', 'RENAME TO',
  'ADD CONSTRAINT', 'DROP CONSTRAINT', 'MODIFY', 'CHANGE',
  'SERIAL', 'BIGSERIAL', 'VARCHAR', 'INTEGER', 'INT', 'BIGINT', 'SMALLINT',
  'TEXT', 'BOOLEAN', 'DATE', 'TIMESTAMP', 'DECIMAL', 'NUMERIC', 'REAL',
  'DOUBLE PRECISION', 'CHAR', 'CHARACTER VARYING',
  'UNIQUE', 'CHECK', 'DEFAULT', 'REFERENCES', 'CASCADE', 'RESTRICT',
  'IF EXISTS', 'IF NOT EXISTS', 'CONSTRAINT',
]

const DDL_SNIPPETS = [
  {
    label: 'CREATE TABLE basic',
    insertText: 'CREATE TABLE ${1:table_name} (\n\tid SERIAL PRIMARY KEY,\n\t${2:column_name} ${3:VARCHAR(100)}\n);',
    detail: 'Create a basic table with primary key',
  },
  {
    label: 'CREATE TABLE full',
    insertText: 'CREATE TABLE ${1:table_name} (\n\tid SERIAL PRIMARY KEY,\n\t${2:column_name} ${3:VARCHAR(100)} ${4:NOT NULL},\n\t${5:column_name2} ${6:INTEGER},\n\tcreated_at TIMESTAMP DEFAULT NOW()\n);',
    detail: 'Create a table with multiple columns',
  },
  {
    label: 'ALTER TABLE ADD COLUMN',
    insertText: 'ALTER TABLE ${1:table_name} ADD COLUMN ${2:column_name} ${3:VARCHAR(100)};',
    detail: 'Add a new column to existing table',
  },
  {
    label: 'ALTER TABLE DROP COLUMN',
    insertText: 'ALTER TABLE ${1:table_name} DROP COLUMN ${2:column_name};',
    detail: 'Remove a column from table',
  },
  {
    label: 'ALTER TABLE ADD PRIMARY KEY',
    insertText: 'ALTER TABLE ${1:table_name} ADD CONSTRAINT ${2:pk_name} PRIMARY KEY (${3:column_name});',
    detail: 'Add primary key constraint',
  },
  {
    label: 'ALTER TABLE ADD FOREIGN KEY',
    insertText: 'ALTER TABLE ${1:table_name} ADD CONSTRAINT ${2:fk_name} FOREIGN KEY (${3:column_name}) REFERENCES ${4:ref_table}(${5:ref_column});',
    detail: 'Add foreign key constraint',
  },
  {
    label: 'ALTER TABLE ADD UNIQUE',
    insertText: 'ALTER TABLE ${1:table_name} ADD CONSTRAINT ${2:uq_name} UNIQUE (${3:column_name});',
    detail: 'Add unique constraint',
  },
  {
    label: 'ALTER TABLE ADD CHECK',
    insertText: 'ALTER TABLE ${1:table_name} ADD CONSTRAINT ${2:chk_name} CHECK (${3:condition});',
    detail: 'Add check constraint',
  },
  {
    label: 'ALTER TABLE RENAME COLUMN',
    insertText: 'ALTER TABLE ${1:table_name} RENAME COLUMN ${2:old_name} TO ${3:new_name};',
    detail: 'Rename a column',
  },
  {
    label: 'CREATE INDEX',
    insertText: 'CREATE INDEX ${1:idx_name} ON ${2:table_name} (${3:column_name});',
    detail: 'Create an index',
  },
  {
    label: 'CREATE UNIQUE INDEX',
    insertText: 'CREATE UNIQUE INDEX ${1:idx_name} ON ${2:table_name} (${3:column_name});',
    detail: 'Create a unique index',
  },
  {
    label: 'DROP TABLE',
    insertText: 'DROP TABLE IF EXISTS ${1:table_name};',
    detail: 'Drop a table safely',
  },
]

const TABLES = [
  { name: 'usuarios', columns: ['id', 'nombre', 'email', 'fecha_registro', 'edad', 'ciudad', 'activo'] },
  { name: 'pedidos', columns: ['id', 'usuario_id', 'monto', 'fecha'] },
]

export function SqlEditor({
  value,
  onChange,
  onExecute,
  onSaveSuccess,
  isLoading,
  error,
  errorTimestamp,
  errorExample,
  exerciseId,
  exercise,
  isValidated = false,
  isDDL = false,
}: SqlEditorProps) {
  const { theme } = useTheme()
  const { user, isLoaded: isClerkLoaded } = useUser()
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [showSignupPrompt, setShowSignupPrompt] = useState(false)
  const createSubmission = useCreateSubmission()
  const { data: solvedExercises } = useSolvedExercises()
  
  // Ref to prevent double-triggering of save on validation
  const hasTriggeredSaveRef = useRef(false)
  
  const wasAlreadySolved = exerciseId ? solvedExercises?.has(exerciseId) : false
  
  // Reset the save trigger when exercise changes
  useEffect(() => {
    hasTriggeredSaveRef.current = false
    setIsSaved(false)
  }, [exerciseId])
  
  useEffect(() => {
    if (!isValidated || isSaved || wasAlreadySolved || hasTriggeredSaveRef.current) return
    if (!exerciseId) return
    
    // Wait for Clerk to load before deciding what to do
    if (!isClerkLoaded) {
      console.log('[SqlEditor] Waiting for Clerk to load...')
      return
    }
    
    hasTriggeredSaveRef.current = true
    
    console.log('[SqlEditor] Exercise validated, user state:', { isClerkLoaded, hasUser: !!user })
    
    if (user) {
      createSubmission.mutateAsync({ exerciseId, solution: value })
        .then((data) => {
          console.log('Submission saved successfully:', data)
          setIsSaved(true)
          toast.success('Progreso guardado')
          onSaveSuccess?.()
        })
        .catch((err) => {
          console.error('Failed to save submission:', err)
          hasTriggeredSaveRef.current = false
          toast.error('Error al guardar el progreso')
        })
    } else {
      // Only show signup prompt for truly unauthenticated users
      const completed = addLocalCompletedExercise(exerciseId)
      if (completed.length === 1 && !isSignupDismissed()) {
        setShowSignupPrompt(true)
      }
    }
  }, [isValidated, isSaved, wasAlreadySolved, exerciseId, user, isClerkLoaded, value, createSubmission, onSaveSuccess])

  const handleSignupSkip = useCallback(() => {
    dismissSignup()
    setShowSignupPrompt(false)
  }, [])

  const handleEditorDidMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: typeof Monaco
  ) => {
    editorRef.current = editor

    monaco.languages.registerCompletionItemProvider('sql', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position)
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        }

        const allKeywords = isDDL 
          ? [...SQL_KEYWORDS, ...DDL_KEYWORDS]
          : SQL_KEYWORDS

        const suggestions: Monaco.languages.CompletionItem[] = [
          ...allKeywords.map((keyword) => ({
            label: keyword,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: keyword,
            range,
          })),
          ...TABLES.flatMap((table) => [
            {
              label: table.name,
              kind: monaco.languages.CompletionItemKind.Class,
              insertText: table.name,
              detail: `Tabla ${table.name}`,
              documentation: `Columnas: ${table.columns.join(', ')}`,
              range,
            },
            ...table.columns.map((col) => ({
              label: `${table.name}.${col}`,
              kind: monaco.languages.CompletionItemKind.Field,
              insertText: col,
              detail: `Columna de ${table.name}`,
              range,
            })),
          ]),
        ]

        // Add DDL snippets for DDL exercises
        if (isDDL) {
          suggestions.push(
            ...DDL_SNIPPETS.map((snippet) => ({
              label: snippet.label,
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: snippet.insertText,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: snippet.detail,
              documentation: 'Snippet DDL',
              range,
            }))
          )
        }

        return { suggestions }
      },
    })

    editor.updateOptions({
      quickSuggestions: { other: true, comments: true, strings: true },
      suggestOnTriggerCharacters: true,
      parameterHints: { enabled: true },
    })
  }

  const formatSQL = useCallback(() => {
    if (value) {
      const formattedSQL = format(value, {
        language: 'postgresql',
        keywordCase: 'upper',
      })
      onChange(formattedSQL)
    }
  }, [value, onChange])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Enter to execute
      if (e.key === 'Enter' && e.ctrlKey && !e.metaKey && !e.shiftKey) {
        e.preventDefault()
        onExecute()
      }
      // Ctrl+Shift+F to format
      if (e.key === 'f' && e.ctrlKey && e.shiftKey) {
        e.preventDefault()
        formatSQL()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onExecute, formatSQL])
  
  const showSavedState = isSaved || wasAlreadySolved

  const hasError = !!error

  return (
    <div className="space-y-4">
      {/* Glowing border wrapper */}
      <div className="group relative">
        {/* Outer glow - blurred */}
        <div 
          className={cn(
            "absolute -inset-px rounded-xl transition-all duration-300 blur-sm",
            isValidated 
              ? "bg-gradient-to-r from-emerald-500/60 via-emerald-500/30 to-emerald-500/60 opacity-100"
              : hasError
                ? "bg-gradient-to-r from-red-500/50 via-red-500/20 to-red-500/50 opacity-100"
                : "bg-gradient-to-r from-primary/50 via-transparent to-primary/50 opacity-0 group-focus-within:opacity-100"
          )} 
        />
        {/* Inner glow - sharp */}
        <div 
          className={cn(
            "absolute -inset-px rounded-xl transition-all duration-300",
            isValidated
              ? "bg-gradient-to-r from-emerald-500/40 via-transparent to-emerald-500/40 opacity-100"
              : hasError
                ? "bg-gradient-to-r from-red-500/30 via-transparent to-red-500/30 opacity-100"
                : "bg-gradient-to-r from-primary/30 via-transparent to-primary/30 opacity-0 group-focus-within:opacity-100"
          )} 
        />
        <Card 
          className={cn(
            "relative overflow-hidden transition-colors duration-300",
            isValidated 
              ? "border-emerald-500/30" 
              : hasError
                ? "border-red-500/30"
                : "border-transparent group-focus-within:border-primary/20"
          )}
        >
          <CardContent className="p-0">
            {/* Responsive editor height: smaller on mobile, larger on desktop */}
            <div className="h-[150px] sm:h-[200px] lg:h-[250px]">
              <Editor
                height="100%"
                defaultLanguage="sql"
                value={value}
                onChange={(val) => onChange(val || '')}
                theme={theme === 'light' ? 'vs-light' : 'vs-dark'}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: 'on',
                  wordWrap: 'on',
                  automaticLayout: true,
                  tabSize: 2,
                  scrollBeyondLastLine: false,
                  quickSuggestionsDelay: 10,
                  padding: { top: 8, bottom: 8 },
                  suggest: {
                    showWords: true,
                    preview: true,
                    showMethods: true,
                    showFunctions: true,
                  },
                }}
                onMount={handleEditorDidMount}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={onExecute} disabled={isLoading} className="flex-1 sm:flex-none">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Ejecutando...' : 'Ejecutar'}
          </Button>
          <Button variant="outline" onClick={formatSQL} className="flex-1 sm:flex-none">
            <FileCode className="mr-2 h-4 w-4" />
            <span className="sm:inline">Formatear</span>
          </Button>
          {createSubmission.isPending && (
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="hidden sm:inline">Guardando...</span>
            </span>
          )}
          {showSavedState && !createSubmission.isPending && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span className="hidden sm:inline">
                {wasAlreadySolved && !isSaved ? 'Ya resuelto' : 'Guardado'}
              </span>
            </span>
          )}
        </div>
        <div className="hidden sm:block text-sm text-muted-foreground">
          <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl</kbd>
          {' + '}
          <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd>
          {' para ejecutar'}
        </div>
      </div>

      {error && (
        <ErrorMessage
          message={error}
          example={errorExample}
          timestamp={errorTimestamp}
          exercise={exercise}
          userQuery={value}
        />
      )}

      <SignupPromptModal
        isOpen={showSignupPrompt}
        onClose={() => setShowSignupPrompt(false)}
        onSkip={handleSignupSkip}
      />
    </div>
  )
}

