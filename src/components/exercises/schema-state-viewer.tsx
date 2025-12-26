'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Table, 
  Columns, 
  Key, 
  Link, 
  Hash, 
  CheckCircle2, 
  XCircle, 
  ChevronDown,
  ChevronRight,
  Database
} from 'lucide-react'
import type { SchemaInfo, TableInfo, ColumnInfo, ConstraintInfo, IndexInfo } from '@/lib/db-service'
import type { DDLValidationResult } from '@/lib/ddl-validator'
import { cn } from '@/lib/utils'

interface SchemaStateViewerProps {
  schemaInfo: SchemaInfo | null
  validationResult?: DDLValidationResult | null
  isLoading?: boolean
}

function ConstraintIcon({ type }: { type: ConstraintInfo['type'] }) {
  switch (type) {
    case 'PRIMARY KEY':
      return <Key className="w-3.5 h-3.5 text-amber-500" />
    case 'FOREIGN KEY':
      return <Link className="w-3.5 h-3.5 text-blue-500" />
    case 'UNIQUE':
      return <Hash className="w-3.5 h-3.5 text-purple-500" />
    case 'CHECK':
      return <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
    default:
      return null
  }
}

function ColumnRow({ column, isPrimaryKey }: { column: ColumnInfo; isPrimaryKey: boolean }) {
  return (
    <div className="flex items-center gap-2 py-1 px-2 text-sm hover:bg-muted/50 rounded">
      <Columns className="w-3.5 h-3.5 text-muted-foreground" />
      <span className={cn("font-mono", isPrimaryKey && "font-semibold text-amber-600 dark:text-amber-400")}>
        {column.name}
      </span>
      <span className="text-muted-foreground text-xs">
        {column.type}
        {!column.nullable && <span className="ml-1 text-red-500">NOT NULL</span>}
      </span>
      {isPrimaryKey && <Key className="w-3 h-3 text-amber-500" />}
    </div>
  )
}

function ConstraintRow({ constraint }: { constraint: ConstraintInfo }) {
  return (
    <div className="flex items-center gap-2 py-1 px-2 text-sm hover:bg-muted/50 rounded">
      <ConstraintIcon type={constraint.type} />
      <span className="font-mono text-xs">{constraint.name}</span>
      <span className="text-muted-foreground text-xs">
        ({constraint.columns.join(', ')})
      </span>
      {constraint.definition && (
        <span className="text-xs text-muted-foreground truncate max-w-[200px]">
          {constraint.definition}
        </span>
      )}
    </div>
  )
}

function IndexRow({ index }: { index: IndexInfo }) {
  return (
    <div className="flex items-center gap-2 py-1 px-2 text-sm hover:bg-muted/50 rounded">
      <Hash className="w-3.5 h-3.5 text-cyan-500" />
      <span className="font-mono text-xs">{index.name}</span>
      <span className="text-muted-foreground text-xs">
        ({index.columns.join(', ')})
      </span>
      {index.isUnique && (
        <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded">
          UNIQUE
        </span>
      )}
    </div>
  )
}

function TableCard({ table, isValid }: { table: TableInfo; isValid?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(true)
  
  const primaryKeyColumns = table.constraints
    .filter(c => c.type === 'PRIMARY KEY')
    .flatMap(c => c.columns)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "border rounded-lg overflow-hidden",
        isValid === true && "border-green-500/50 bg-green-50/50 dark:bg-green-950/20",
        isValid === false && "border-red-500/50 bg-red-50/50 dark:bg-red-950/20",
        isValid === undefined && "border-border"
      )}
    >
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 p-3 hover:bg-muted/50 transition-colors"
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
        <Table className="w-4 h-4 text-primary" />
        <span className="font-semibold">{table.name}</span>
        <span className="text-xs text-muted-foreground ml-auto">
          {table.columns.length} columna{table.columns.length !== 1 ? 's' : ''}
        </span>
        {isValid === true && <CheckCircle2 className="w-4 h-4 text-green-500" />}
        {isValid === false && <XCircle className="w-4 h-4 text-red-500" />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t px-2 py-2 space-y-2">
              {/* Columns */}
              <div>
                <div className="text-xs font-medium text-muted-foreground px-2 py-1">
                  Columnas
                </div>
                {table.columns.map(column => (
                  <ColumnRow
                    key={column.name}
                    column={column}
                    isPrimaryKey={primaryKeyColumns.includes(column.name)}
                  />
                ))}
              </div>

              {/* Constraints */}
              {table.constraints.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground px-2 py-1">
                    Constraints
                  </div>
                  {table.constraints.map(constraint => (
                    <ConstraintRow key={constraint.name} constraint={constraint} />
                  ))}
                </div>
              )}

              {/* Indexes */}
              {table.indexes.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground px-2 py-1">
                    Índices
                  </div>
                  {table.indexes.map(index => (
                    <IndexRow key={index.name} index={index} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function ValidationErrors({ errors }: { errors: string[] }) {
  if (errors.length === 0) return null

  return (
    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-3">
      <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-medium text-sm mb-2">
        <XCircle className="w-4 h-4" />
        Errores de validación
      </div>
      <ul className="space-y-1">
        {errors.map((error, index) => (
          <li key={index} className="text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
            <span className="text-red-400">•</span>
            {error}
          </li>
        ))}
      </ul>
    </div>
  )
}

function TestQueryResults({ results }: { results: DDLValidationResult['testQueryResults'] }) {
  if (!results || results.results.length === 0) return null

  return (
    <div className="border rounded-lg p-3 space-y-2">
      <div className="font-medium text-sm flex items-center gap-2">
        <Database className="w-4 h-4" />
        Pruebas de consulta
        {results.passed ? (
          <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
        ) : (
          <XCircle className="w-4 h-4 text-red-500 ml-auto" />
        )}
      </div>
      <div className="space-y-1">
        {results.results.map((test, index) => (
          <div
            key={index}
            className={cn(
              "text-xs p-2 rounded font-mono",
              test.actual === test.expected
                ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
            )}
          >
            <div className="flex items-center gap-2">
              {test.actual === test.expected ? (
                <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
              ) : (
                <XCircle className="w-3 h-3 flex-shrink-0" />
              )}
              <span className="truncate">{test.query}</span>
            </div>
            {test.actual !== test.expected && (
              <div className="mt-1 text-xs opacity-75">
                Esperado: {test.expected ? 'éxito' : 'error'} | Resultado: {test.actual ? 'éxito' : 'error'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export function SchemaStateViewer({ schemaInfo, validationResult, isLoading }: SchemaStateViewerProps) {
  if (isLoading) {
    return (
      <div className="border rounded-lg p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-muted rounded w-1/3" />
          <div className="h-20 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (!schemaInfo || schemaInfo.tables.length === 0) {
    return (
      <div className="border rounded-lg p-4 text-center text-muted-foreground">
        <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">El esquema está vacío</p>
        <p className="text-xs">Ejecuta tu consulta DDL para ver los cambios</p>
      </div>
    )
  }

  const tableValidity = validationResult?.schemaValidation?.tableFound

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Database className="w-4 h-4" />
        Estado del Esquema
        {validationResult?.isValid && (
          <span className="ml-auto flex items-center gap-1 text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-4 h-4" />
            Válido
          </span>
        )}
      </div>

      {validationResult?.schemaValidation?.errors && (
        <ValidationErrors errors={validationResult.schemaValidation.errors} />
      )}

      <div className="space-y-2">
        {schemaInfo.tables.map(table => (
          <TableCard
            key={table.name}
            table={table}
            isValid={tableValidity}
          />
        ))}
      </div>

      {validationResult?.testQueryResults && (
        <TestQueryResults results={validationResult.testQueryResults} />
      )}
    </div>
  )
}

