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
import { useCreateSubmission, useSolvedExercises } from '@/hooks/use-submissions'

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
  exerciseTitle?: string
  nextExerciseId?: string
  isValidated?: boolean
}

const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP',
  'TABLE', 'DATABASE', 'ALTER', 'INDEX', 'GROUP BY', 'ORDER BY', 'HAVING',
  'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'UNION',
  'VALUES', 'INTO', 'SET', 'NULL', 'NOT NULL', 'PRIMARY KEY', 'FOREIGN KEY',
  'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'DISTINCT', 'AS', 'AND', 'OR', 'IN',
  'BETWEEN', 'LIKE', 'IS', 'ASC', 'DESC', 'ON', 'LIMIT',
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
  isValidated = false,
}: SqlEditorProps) {
  const { theme } = useTheme()
  const { user } = useUser()
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const createSubmission = useCreateSubmission()
  const { data: solvedExercises } = useSolvedExercises()
  
  const wasAlreadySolved = exerciseId ? solvedExercises?.has(exerciseId) : false
  
  const autoSave = useCallback(async () => {
    if (!user || !exerciseId || isSaved || wasAlreadySolved) return
    
    try {
      await createSubmission.mutateAsync({ exerciseId, solution: value })
      setIsSaved(true)
      toast.success('¡Progreso guardado automáticamente!')
      onSaveSuccess?.()
    } catch {
      toast.error('Error al guardar el progreso')
    }
  }, [user, exerciseId, isSaved, wasAlreadySolved, createSubmission, onSaveSuccess, value])
  
  // Auto-save when exercise is validated correctly
  useEffect(() => {
    if (isValidated && user && !isSaved && !wasAlreadySolved) {
      autoSave()
    }
  }, [isValidated, user, isSaved, wasAlreadySolved, autoSave])

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

        const suggestions = [
          ...SQL_KEYWORDS.map((keyword) => ({
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

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
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
        />
      )}
    </div>
  )
}

