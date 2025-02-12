'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Lightbulb, ArrowLeft } from 'lucide-react'
import { Tooltip } from './ui/tooltip'
import { ErrorBoundary } from './error-boundary'
import { SQLEditor } from './sql-editor'
import { ResultsTable } from './results-table'
import { Celebration } from './celebration'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { dbService } from '@/lib/db-service'
import { validateQueryResult } from '@/lib/validation-service'

interface QueryResult {
  rows: any[]
  fields: { name: string }[]
  mensajeExito?: string
  error?: boolean
  message?: string | null
  example?: string | null
}

export function ExerciseView({ exercise }: { exercise: any }) {
  const router = useRouter()
  const [consulta, setConsulta] = useState('')
  const [resultados, setResultados] = useState<QueryResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [errorTimestamp, setErrorTimestamp] = useState<number>(0)
  const [errorExample, setErrorExample] = useState<string | null>(null)

  useEffect(() => {
    // Initialize database when component mounts
    dbService.initialize().catch(console.error)
  }, [])

  const ejecutarConsulta = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Execute query in the browser
      const result = await dbService.executeQuery(consulta)

      if (result.error) {
        setError(result.message || 'Error executing query')
        setErrorExample(result.example || null)
        setErrorTimestamp(Date.now())
        setResultados({ rows: [], fields: [] })
        return
      }

      // Validate the result against exercise conditions
      const isValid = validateQueryResult(result, exercise.validation)

      setResultados({
        ...result,
        mensajeExito: isValid ? exercise.success_message : undefined
      })

      if (isValid) {
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 4000)
      } else {
        setError('La consulta se ejecutó correctamente, pero el resultado no es el esperado')
        setErrorTimestamp(Date.now())
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
      setErrorTimestamp(Date.now())
    } finally {
      setIsLoading(false)
    }
  }

  const reiniciarEjercicio = () => {
    setConsulta('')
    setResultados(null)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full lg:w-1/3"
        >
          <Card className="h-full flex flex-col sticky top-4">
            <CardHeader>
              <CardTitle>{exercise.title}</CardTitle>
              <CardDescription>Dificultad: {exercise.difficulty}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow">
              <div>
                <h3 className="font-semibold mb-2">Descripción:</h3>
                <p className="text-sm text-muted-foreground">{exercise.description}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Detalles:</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{exercise.details}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Ejemplo:</h3>
                <div className="text-sm text-muted-foreground">
                  <p><strong>Entrada:</strong> {exercise.example.entrada}</p>
                  <p><strong>Salida esperada:</strong> {exercise.example.salida}</p>
                </div>
              </div>
              <Accordion type="single" collapsible>
                <AccordionItem value="pista">
                  <Tooltip content="¡Las pistas te ayudarán a resolver el ejercicio!">
                    <AccordionTrigger className="hover:text-primary">
                      <Lightbulb className="mr-2 h-4 w-4" /> Ver Pista
                    </AccordionTrigger>
                  </Tooltip>
                  <AccordionContent>
                    {exercise.hint}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full lg:w-2/3"
        >
          <div className="space-y-4">
            <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Editor SQL</CardTitle>
                    <CardDescription>Escribe tu consulta SQL aquí</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/')}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Regresar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ErrorBoundary>
                  <SQLEditor
                    value={consulta}
                    onChange={setConsulta}
                    onExecute={ejecutarConsulta}
                    isLoading={isLoading}
                    error={error}
                    errorTimestamp={errorTimestamp}
                    errorExample={errorExample}
                  />
                </ErrorBoundary>
              </CardContent>
            </Card>

            <AnimatePresence mode="wait">
              {resultados && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-lg">
                    <CardHeader>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <CardTitle>Resultados</CardTitle>
                        {error ? (
                          <CardDescription className="text-red-500 dark:text-red-400">
                            {error}
                          </CardDescription>
                        ) : resultados.mensajeExito && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            <CardDescription className="text-green-600 dark:text-green-400 mt-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
                              {resultados.mensajeExito}
                            </CardDescription>
                          </motion.div>
                        )}
                      </motion.div>
                    </CardHeader>
                    <CardContent>
                      <ResultsTable results={resultados} />
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-end"
            >
              <Button 
                variant="outline" 
                onClick={reiniciarEjercicio}
              >
                Reiniciar
              </Button>
            </motion.div>
          </div>
        </motion.section>
      </div>
      {showCelebration && <Celebration />}
    </div>
  )
} 