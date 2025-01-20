'use client'

import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { Moon, Sun, RotateCcw, Lightbulb, ArrowLeft, ArrowRight, Github, BookOpen, Linkedin, Coffee } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { dbService } from '@/lib/db-service'
import { ResultsTable } from './results-table'
import { SQLEditor } from './sql-editor'
import { useTheme } from 'next-themes'
import { Celebration } from './celebration'
import { Tooltip } from './ui/tooltip'
import { ErrorBoundary } from './error-boundary'
import { validateQueryResult } from '@/lib/validation-service'
import { motion, AnimatePresence } from 'framer-motion'
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Exercise, getExercises } from '@/lib/exercises-service'
import { cn } from "@/lib/utils"

// Agregar estas interfaces al inicio del archivo
interface QueryResult {
  rows: any[]
  fields: { name: string }[]
  mensajeExito?: string
  error?: boolean
  message?: string | null // Cambiar a string | null
  example?: string | null // Cambiar a string | null
}

type Difficulty = 'Principiante' | 'Intermedio' | 'Avanzado';

const difficultyOrder: Difficulty[] = ['Principiante', 'Intermedio', 'Avanzado'];

const difficultyColors: Record<Difficulty, string> = {
  'Principiante': 'dark:bg-emerald-500/20 dark:text-emerald-500 dark:border-emerald-500/20 bg-emerald-100 text-emerald-700 border-emerald-200',
  'Intermedio': 'dark:bg-yellow-500/20 dark:text-yellow-500 dark:border-yellow-500/20 bg-yellow-100 text-yellow-700 border-yellow-200',
  'Avanzado': 'dark:bg-red-500/20 dark:text-red-500 dark:border-red-500/20 bg-red-100 text-red-700 border-red-200',
};

const difficultyIcons: Record<Difficulty, string> = {
  'Principiante': '🌱',
  'Intermedio': '🚀',
  'Avanzado': '⚡',
};

export function PlataformaSqlIa() {
  const { theme, setTheme } = useTheme()
  const [ejercicioActual, setEjercicioActual] = useState<Exercise | null>(null)
  const [ejercicios, setEjercicios] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [consulta, setConsulta] = useState('')
  const [resultados, setResultados] = useState<QueryResult | null>(null)
  const [historial, setHistorial] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [errorTimestamp, setErrorTimestamp] = useState<number>(0)
  const [errorExample, setErrorExample] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  const groupedExercises = React.useMemo(() => {
    return ejercicios.reduce((acc, exercise) => {
      if (!acc[exercise.difficulty]) {
        acc[exercise.difficulty] = [];
      }
      acc[exercise.difficulty].push(exercise);
      return acc;
    }, {} as Record<string, Exercise[]>);
  }, [ejercicios]);

  useEffect(() => {
    async function initDB() {
      try {
        await dbService.initialize()
      } catch (error) {
        console.error('Error initializing database:', error)
      }
    }
    initDB()
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    async function loadExercises() {
      try {
        const response = await fetch('/api/exercises')
        if (!response.ok) {
          throw new Error('Failed to fetch exercises')
        }
        const data = await response.json()
        setEjercicios(data.exercises)
      } catch (error) {
        console.error('Error loading exercises:', error)
      } finally {
        setLoading(false)
      }
    }

    loadExercises()
  }, [])

  const cambiarTema = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const seleccionarEjercicio = async (ejercicio: Exercise) => {
    try {
      setLoading(true)
      setEjercicioActual(ejercicio)
      setConsulta('')
      setResultados(null)
    } catch (error) {
      console.error('Error selecting exercise:', error)
    } finally {
      setLoading(false)
    }
  }

  const ejecutarConsulta = async () => {
    setIsLoading(true)
    setError(null)
    try {
      if (!ejercicioActual) {
        throw new Error('Selecciona un ejercicio primero')
      }

      // Initialize database if needed
      await dbService.initialize()

      // Execute query
      const result = await dbService.executeQuery(consulta)

      if (result.error) {
        setError(result.message || 'Error desconocido')
        setErrorExample(result.example || null)
        setErrorTimestamp(Date.now())
        setResultados({ rows: [], fields: [] })
        return
      }

      // Validate the result against exercise conditions
      const isValid = validateQueryResult(result, ejercicioActual.validation)

      setResultados({
        ...result,
        mensajeExito: isValid ? ejercicioActual.success_message : undefined
      })
      setHistorial([...historial, consulta])

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

  // No renderizar nada hasta que el componente esté montado
  if (!mounted) {
    return null
  }

  const irEjercicioAnterior = () => {
    const ejercicioActualIndex = ejercicios.findIndex(e => e.id === ejercicioActual?.id)
    if (ejercicioActualIndex > 0) {
      setEjercicioActual(ejercicios[ejercicioActualIndex - 1])
      setConsulta('')
      setResultados(null)
    }
  }

  const irSiguienteEjercicio = () => {
    const ejercicioActualIndex = ejercicios.findIndex(e => e.id === ejercicioActual?.id)
    if (ejercicioActualIndex < ejercicios.length - 1) {
      setEjercicioActual(ejercicios[ejercicioActualIndex + 1])
      setConsulta('')
      setResultados(null)
    }
  }

  const volverAInicio = () => {
    setEjercicioActual(null)
    setConsulta('')
    setResultados(null)
  }

  return (
    <>
      <Head>
        <title>sql4All - Plataforma de Práctica SQL </title>
      </Head>
      <ErrorBoundary>
        <div className="min-h-screen bg-background text-foreground bg-gradient-to-b from-background to-secondary/20">
          <header className="p-4 flex justify-between items-center border-b border-border/40 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
            <div className="flex items-center gap-4">
              <button
                onClick={volverAInicio}
                className="text-2xl font-bold hover:text-primary transition-colors"
              >
                sql4All
              </button>
              <Separator orientation="vertical" className="h-6" />
              <nav className="flex items-center gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Documentación
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Documentación SQL4All</DialogTitle>
                      <DialogDescription>
                        Guía completa de SQL y uso de la plataforma
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-6 space-y-6">
                      <section className="space-y-4">
                        <h3 className="text-lg font-semibold">Introducción a SQL</h3>
                        <p>SQL (Structured Query Language) es el lenguaje estándar para manipular y consultar bases de datos relacionales.</p>
                      </section>
                      <section className="space-y-4">
                        <h3 className="text-lg font-semibold">Comandos Básicos</h3>
                        <div className="space-y-2">
                          <h4 className="font-medium">SELECT</h4>
                          <p>Se utiliza para seleccionar datos de una base de datos.</p>
                          <pre className="bg-muted p-2 rounded text-sm">
                            SELECT columna1, columna2 FROM tabla;
                          </pre>
                        </div>
                      </section>
                      <section className="space-y-4">
                        <h3 className="text-lg font-semibold">Uso de la Plataforma</h3>
                        <p>SQL4All te permite practicar SQL de forma interactiva con ejercicios prácticos y retroalimentación inmediata.</p>
                      </section>
                    </div>
                  </DialogContent>
                </Dialog>
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://github.com/camilocbarrera"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://www.linkedin.com/in/cristiancamilocorrea/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://buymeacoffee.com/camilocbarrera"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Buy me a coffee"
                >
                  <Coffee className="h-5 w-5" />
                </a>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={cambiarTema} 
                aria-label="Cambiar tema"
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>
            </div>
          </header>
          <main className="container mx-auto p-4">
            <AnimatePresence mode="wait">
              {!ejercicioActual ? (
                <motion.div
                  key="ejercicios-lista"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="max-w-5xl mx-auto mt-10"
                >
                  <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold dark:text-white text-gray-900 mb-4">
                      Aprende SQL Interactivamente
                    </h1>
                    <p className="dark:text-gray-400 text-gray-600 max-w-2xl mx-auto">
                      Domina SQL paso a paso con ejercicios prácticos. Desde conceptos básicos hasta consultas avanzadas.
                    </p>
                  </div>

                  {loading ? (
                    <div className="flex justify-center items-center min-h-[400px]">
                      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {difficultyOrder.map((difficulty) => (
                        groupedExercises[difficulty] && (
                          <motion.div
                            key={difficulty}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <div className="mb-4">
                              <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl">{difficultyIcons[difficulty]}</span>
                                <h2 className="text-xl font-semibold dark:text-white text-gray-900">
                                  {difficulty}
                                </h2>
                                <div className={`px-2 py-1 rounded-full text-xs ${difficultyColors[difficulty]}`}>
                                  {groupedExercises[difficulty].length} ejercicios
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {groupedExercises[difficulty].map((ejercicio) => (
                                <motion.div
                                  key={ejercicio.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.1 }}
                                >
                                  <Card 
                                    className={cn(
                                      "cursor-pointer transform transition-all duration-200 hover:scale-[1.02]",
                                      "border-border/50 hover:border-primary/50",
                                      "dark:bg-card/95 bg-white/90 backdrop-blur-sm shadow-md hover:shadow-xl",
                                      "dark:hover:bg-accent/50 hover:bg-gray-50/80 h-full"
                                    )}
                                    onClick={() => seleccionarEjercicio(ejercicio)}
                                  >
                                    <CardHeader className="pb-3">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2 dark:text-white text-gray-900">
                                            {ejercicio.title}
                                          </CardTitle>
                                        </div>
                                      </div>
                                    </CardHeader>
                                    <CardContent>
                                      <p className="dark:text-gray-400 text-gray-600 text-sm line-clamp-3 mb-4">
                                        {ejercicio.description}
                                      </p>
                                      <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs dark:text-gray-500 text-gray-600">
                                            ID: {ejercicio.id.slice(0, 4)}
                                          </span>
                                        </div>
                                        <ArrowRight className="h-4 w-4 dark:text-gray-500 text-gray-600 transition-transform duration-200 group-hover:translate-x-1" />
                                      </div>
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                // Vista del editor con lista a la izquierda
                <motion.div
                  key="ejercicio-editor"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col lg:flex-row gap-4"
                >
                  {/* Panel izquierdo - Descripción del ejercicio */}
                  <motion.section
                    initial={{ opacity: 0 }}  // Cambiar initial
                    animate={{ opacity: 1 }}  // Cambiar animate
                    className="w-full lg:w-1/3"
                  >
                    <Card className="h-full flex flex-col sticky top-4"> {/* Añadir sticky para mejor UX */}
                      <CardHeader>
                        <CardTitle>{ejercicioActual.title}</CardTitle>
                        <CardDescription>Dificultad: {ejercicioActual.difficulty}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 flex-grow">
                        <div>
                          <h3 className="font-semibold mb-2">Descripción:</h3>
                          <p className="text-sm text-muted-foreground">{ejercicioActual.description}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Detalles:</h3>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">{ejercicioActual.details}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Ejemplo:</h3>
                          <div className="text-sm text-muted-foreground">
                            <p><strong>Entrada:</strong> {ejercicioActual.example.entrada}</p>
                            <p><strong>Salida esperada:</strong> {ejercicioActual.example.salida}</p>
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
                              {ejercicioActual.hint}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </CardContent>
                    </Card>
                  </motion.section>

                  {/* Panel derecho - Editor y resultados */}
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
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEjercicioActual(null)
                                  setConsulta('')
                                  setResultados(null)
                                }}
                              >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Regresar
                              </Button>
                              <div className="flex gap-1">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={irEjercicioAnterior}
                                  disabled={ejercicioActual?.id === ejercicios[0]?.id}
                                >
                                  <ArrowLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={irSiguienteEjercicio}
                                  disabled={ejercicioActual?.id === ejercicios[ejercicios.length - 1]?.id}
                                >
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
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
                          disabled={!ejercicioActual}
                        >
                          <RotateCcw className="mr-2 h-4 w-4" /> Reiniciar
                        </Button>
                      </motion.div>
                    </div>
                  </motion.section>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </ErrorBoundary>
      {showCelebration && <Celebration />}
    </>
  )
}
