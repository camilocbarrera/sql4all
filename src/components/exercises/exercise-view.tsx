'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, ArrowLeft, ArrowRight, CheckCircle2, Home, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Badge,
} from '@/components/ui'
import { ErrorBoundary } from '@/components/shared/error-boundary'
import { ResultsTable } from '@/components/shared/results-table'
import { Celebration } from '@/components/shared/celebration'
import { SqlEditor } from './sql-editor'
import { SchemaHelper } from './schema-helper'
import { useLocalQuery } from '@/hooks/use-local-query'
import { useSavedSolution } from '@/hooks/use-submissions'
import { dbService } from '@/lib/db-service'
import { validateQueryResult } from '@/lib/validation-service'
import type { Exercise } from '@/lib/validations'

interface QueryResult {
  rows: Record<string, unknown>[]
  fields: { name: string }[]
  mensajeExito?: string
  error?: boolean
  message?: string | null
  example?: string | null
}

interface ExerciseViewProps {
  exercise: Exercise
  nextExerciseId?: string
  prevExerciseId?: string
  currentIndex?: number
  totalExercises?: number
}

export function ExerciseView({ 
  exercise, 
  nextExerciseId, 
  prevExerciseId,
  currentIndex,
  totalExercises 
}: ExerciseViewProps) {
  const router = useRouter()
  const { data: savedSolution } = useSavedSolution(exercise.id)
  const { query, setQuery, clearQuery, isHydrated } = useLocalQuery(exercise.id, { savedSolution })
  const [results, setResults] = useState<QueryResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [errorTimestamp, setErrorTimestamp] = useState<number>(0)
  const [errorExample, setErrorExample] = useState<string | null>(null)
  const [isValidated, setIsValidated] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isInfoExpanded, setIsInfoExpanded] = useState(false)

  useEffect(() => {
    dbService.initialize().catch(console.error)
  }, [])
  
  const handleSaveSuccess = useCallback(() => {
    setIsSaved(true)
    clearQuery()
  }, [clearQuery])

  const executeQuery = async () => {
    setIsLoading(true)
    setError(null)
    setIsValidated(false)

    try {
      const result = await dbService.executeQuery(query)

      if (result.error) {
        setError(result.message || 'Error al ejecutar la consulta')
        setErrorExample(result.example || null)
        setErrorTimestamp(Date.now())
        setResults({ rows: [], fields: [] })
        return
      }

      const isValid = validateQueryResult(result, exercise.validation)

      setResults({
        ...result,
        mensajeExito: isValid ? exercise.successMessage : undefined,
      })

      if (isValid) {
        setIsValidated(true)
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 4000)
      } else {
        setError('La consulta se ejecutó, pero el resultado no es el esperado')
        setErrorTimestamp(Date.now())
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      setErrorTimestamp(Date.now())
    } finally {
      setIsLoading(false)
    }
  }

  const resetExercise = useCallback(() => {
    clearQuery()
    setResults(null)
    setError(null)
    setIsValidated(false)
    setIsSaved(false)
  }, [clearQuery])

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Exercise Info Panel - Collapsible on mobile */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-1/3"
        >
          <Card className="lg:sticky lg:top-20">
            <CardHeader 
              className="cursor-pointer lg:cursor-default"
              onClick={() => setIsInfoExpanded(!isInfoExpanded)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg sm:text-xl line-clamp-2">{exercise.title}</CardTitle>
                  <CardDescription className="line-clamp-3 mt-1">{exercise.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className="text-xs">{exercise.difficulty}</Badge>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 lg:hidden"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsInfoExpanded(!isInfoExpanded)
                    }}
                  >
                    {isInfoExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            {/* Content - Always visible on desktop, collapsible on mobile */}
            <div className={`${isInfoExpanded ? 'block' : 'hidden'} lg:block`}>
              <CardContent className="space-y-4 sm:space-y-6 pt-0">
                <div>
                  <h3 className="font-semibold mb-2 text-sm">Detalles</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {exercise.details}
                  </p>
                </div>

                <div className="p-3 sm:p-4 rounded-lg bg-muted/50">
                  <h3 className="font-semibold mb-2 text-sm">Ejemplo</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p className="break-words">
                      <strong>Entrada:</strong> {exercise.example.entrada}
                    </p>
                    <p className="break-words">
                      <strong>Salida:</strong> {exercise.example.salida}
                    </p>
                  </div>
                </div>

                <Accordion type="single" collapsible>
                  <AccordionItem value="hint" className="border-none">
                    <AccordionTrigger className="hover:no-underline py-2">
                      <span className="flex items-center gap-2 text-sm">
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        Ver pista
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground p-3 bg-yellow-500/10 rounded-lg">
                        {exercise.hint}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </div>
          </Card>
        </motion.aside>

        {/* Editor & Results Panel */}
        <motion.main
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full lg:w-2/3 space-y-4"
        >
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-lg">Editor SQL</CardTitle>
                  <CardDescription>
                    {currentIndex !== undefined && totalExercises !== undefined ? (
                      <span>Ejercicio {currentIndex + 1} de {totalExercises}</span>
                    ) : (
                      <span>Escribe tu consulta</span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {prevExerciseId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <Link href={`/exercises/${prevExerciseId}`}>
                        <ArrowLeft className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/')}
                  >
                    <Home className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Ejercicios</span>
                  </Button>
                  {nextExerciseId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <Link href={`/exercises/${nextExerciseId}`}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ErrorBoundary>
                {isHydrated && (
                  <SqlEditor
                    value={query}
                    onChange={setQuery}
                    onExecute={executeQuery}
                    onSaveSuccess={handleSaveSuccess}
                    isLoading={isLoading}
                    error={error}
                    errorTimestamp={errorTimestamp}
                    errorExample={errorExample}
                    exerciseId={exercise.id}
                    isValidated={isValidated}
                  />
                )}
              </ErrorBoundary>
            </CardContent>
          </Card>

          <AnimatePresence mode="wait">
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Resultados</CardTitle>
                      {results.mensajeExito && (
                        <Badge className="bg-emerald-500">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Correcto
                        </Badge>
                      )}
                    </div>
                    {results.mensajeExito && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                      >
                        <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                          <p className="text-sm text-emerald-600 dark:text-emerald-400">
                            {results.mensajeExito}
                          </p>
                        </div>
                        
                        {/* Inline Success Actions */}
                        <div className="flex flex-wrap gap-3">
                          {nextExerciseId && (
                            <Button asChild>
                              <Link href={`/exercises/${nextExerciseId}`}>
                                Siguiente ejercicio
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                          <Button variant="outline" asChild>
                            <Link href="/">
                              <Home className="mr-2 h-4 w-4" />
                              Ver todos
                            </Link>
                          </Button>
                          <Button variant="ghost" onClick={resetExercise}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reintentar
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <ResultsTable results={results} />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {!results?.mensajeExito && (
            <div className="flex justify-end">
              <Button variant="outline" onClick={resetExercise}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reiniciar
              </Button>
            </div>
          )}
        </motion.main>
      </div>

      {showCelebration && <Celebration />}
      
      <SchemaHelper />
    </div>
  )
}

