'use client'

import { useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { format } from 'sql-formatter'
import { Button } from './ui/button'
import { Play, FileCode } from 'lucide-react'
import { useTheme } from 'next-themes'
import { ErrorMessage } from './ui/error-message'
import type * as Monaco from 'monaco-editor'
import type { editor } from 'monaco-editor'

interface SQLEditorProps {
  value: string
  onChange: (value: string) => void
  onExecute: () => void
  isLoading?: boolean
  error?: string | null
  errorTimestamp?: number
  errorExample?: string | null
}

const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP',
  'TABLE', 'DATABASE', 'ALTER', 'INDEX', 'GROUP BY', 'ORDER BY', 'HAVING',
  'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'UNION',
  'VALUES', 'INTO', 'SET', 'NULL', 'NOT NULL', 'PRIMARY KEY', 'FOREIGN KEY',
  'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'DISTINCT', 'AS', 'AND', 'OR', 'IN',
  'BETWEEN', 'LIKE', 'IS', 'ASC', 'DESC', 'ON', 'LIMIT'
]

const TABLES = [
  {
    name: 'usuarios',
    columns: ['id', 'nombre', 'email', 'fecha_registro', 'edad', 'ciudad', 'activo']
  },
  {
    name: 'pedidos',
    columns: ['id', 'usuario_id', 'monto', 'fecha']
  }
]

export function SQLEditor({ 
  value, 
  onChange, 
  onExecute, 
  isLoading, 
  error,
  errorTimestamp,
  errorExample 
}: SQLEditorProps) {
  const { theme } = useTheme()
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: typeof Monaco) => {
    editorRef.current = editor

    // Configurar el autocompletado
    monaco.languages.registerCompletionItemProvider('sql', {
      provideCompletionItems: (model: editor.ITextModel, position: Monaco.Position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        const suggestions = [
          ...SQL_KEYWORDS.map(keyword => ({
            label: keyword,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: keyword,
            range
          })),
          ...TABLES.flatMap(table => [
            {
              label: table.name,
              kind: monaco.languages.CompletionItemKind.Class,
              insertText: table.name,
              detail: `Tabla ${table.name}`,
              documentation: `Columnas disponibles: ${table.columns.join(', ')}`,
              range
            },
            ...table.columns.map(column => ({
              label: `${table.name}.${column}`,
              kind: monaco.languages.CompletionItemKind.Field,
              insertText: column,
              detail: `Columna de ${table.name}`,
              range
            }))
          ])
        ];

        return { suggestions };
      }
    });

    // Agregar comando personalizado para ejecutar consulta
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onExecute()
    })

    // Configurar el trigger de autocompletado
    editor.updateOptions({
      quickSuggestions: {
        other: true,
        comments: true,
        strings: true
      },
      suggestOnTriggerCharacters: true,
      parameterHints: {
        enabled: true
      }
    })
  }

  // Manejar atajos de teclado globales
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter para ejecutar
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        onExecute()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onExecute])

  const formatSQL = () => {
    if (value) {
      const formattedSQL = format(value, {
        language: 'postgresql',
        keywordCase: 'upper',
      })
      onChange(formattedSQL)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="border rounded-md overflow-hidden border-border">
        <Editor
          height="200px"
          defaultLanguage="sql"
          value={value}
          onChange={(value) => onChange(value || '')}
          theme={theme === 'light' ? 'vs-light' : 'vs-dark'}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            rulers: [],
            wordWrap: 'on',
            wrappingIndent: 'indent',
            automaticLayout: true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            tabSize: 2,
            contextmenu: true,
            scrollBeyondLastLine: false,
            extraEditorClassName: 'sql-editor',
            quickSuggestionsDelay: 10,
            suggest: {
              showWords: true,
              preview: true,
              showMethods: true,
              showFunctions: true,
              showConstructors: true,
              matchOnWordStartOnly: false
            }
          }}
          onMount={handleEditorDidMount}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button onClick={onExecute} disabled={isLoading}>
            <Play className="mr-2 h-4 w-4" />
            {isLoading ? 'Ejecutando...' : 'Ejecutar'}
          </Button>
          <Button variant="outline" onClick={formatSQL}>
            <FileCode className="mr-2 h-4 w-4" />
            Formatear SQL
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl</kbd> +{" "}
          <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd> para ejecutar
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
