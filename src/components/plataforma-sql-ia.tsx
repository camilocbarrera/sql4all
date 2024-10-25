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
import { ejercicios } from '@/data/ejercicios'
import { Ejercicio } from '@/types/exercises'

// Agregar estas interfaces al inicio del archivo
interface QueryResult {
  rows: any[]
  fields: { name: string }[]
  mensajeExito?: string
  error?: boolean
  message?: string | null // Cambiar a string | null
  example?: string | null // Cambiar a string | null
}

export function PlataformaSqlIa() {
  const { theme, setTheme } = useTheme()
  const [ejercicioActual, setEjercicioActual] = useState<Ejercicio | null>(null)
  const [consulta, setConsulta] = useState('')
  const [resultados, setResultados] = useState<QueryResult | null>(null)
  const [historial, setHistorial] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [errorTimestamp, setErrorTimestamp] = useState<number>(0)
  const [errorExample, setErrorExample] = useState<string | null>(null)

  // Agregar un estado para controlar el montaje
  const [mounted, setMounted] = useState(false)

  // Usar useEffect para manejar el montaje
  useEffect(() => {
    setMounted(true)
  }, [])

  const cambiarTema = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const seleccionarEjercicio = (ejercicio: Ejercicio) => {
    setEjercicioActual(ejercicio)
    setConsulta('')
    setResultados(null)
  }

  // Inicializar la base de datos
  useEffect(() => {
    dbService.initialize().catch(console.error)
  }, [])

  const ejecutarConsulta = async () => {
    setIsLoading(true)
    setError(null)
    try {
      if (!ejercicioActual) {
        throw new Error('Selecciona un ejercicio primero')
      }

      const result = await dbService.executeQuery(consulta)
      
      if (result.error) {
        setError(result.message || 'Error desconocido') // Proporcionar valor por defecto
        setErrorExample(result.example || null) // Proporcionar valor por defecto
        setErrorTimestamp(Date.now())
        setResultados({ rows: [], fields: [] })
        return
      }

      setResultados(result)
      setHistorial([...historial, consulta])

      // Validar el resultado contra la salida esperada
      const isValid = validateQueryResult(result, ejercicioActual.validacion)

      if (isValid) {
        setShowCelebration(true)
        setResultados({
          ...result,
          mensajeExito: ejercicioActual.mensajeExito
        })
        setTimeout(() => setShowCelebration(false), 4000)
      } else {
        setError('La consulta se ejecutó correctamente, pero el resultado no es el esperado')
        setErrorExample(ejercicioActual.ejemplo.salida)
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
        <div className="min-h-screen bg-background text-foreground">
          <header className="p-4 flex justify-between items-center border-b border-border">
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
                // Vista inicial centrada
                <motion.div
                  key="ejercicios-lista"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="max-w-2xl mx-auto mt-20"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Ejercicios SQL</CardTitle>
                      <CardDescription>Selecciona un ejercicio para comenzar a practicar 😏</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {ejercicios.map((ejercicio) => (
                          <motion.div
                            key={ejercicio.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: ejercicio.id * 0.1 }}
                          >
                            <Card 
                              className="cursor-pointer transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.99] hover:border-primary/50"
                              onClick={() => seleccionarEjercicio(ejercicio)}
                            >
                              <CardHeader>
                                <div className="flex justify-between items-start">
                                  <div>
                                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                      {ejercicio.titulo}
                                    </CardTitle>
                                    <CardDescription>Dificultad: {ejercicio.dificultad}</CardDescription>
                                  </div>
                                  <div className="text-muted-foreground">
                                    <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p>{ejercicio.descripcion}</p>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
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
                        <CardTitle>{ejercicioActual.titulo}</CardTitle>
                        <CardDescription>Dificultad: {ejercicioActual.dificultad}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 flex-grow">
                        <div>
                          <h3 className="font-semibold mb-2">Descripción:</h3>
                          <p className="text-sm text-muted-foreground">{ejercicioActual.descripcion}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Detalles:</h3>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">{ejercicioActual.detalles}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Ejemplo:</h3>
                          <div className="text-sm text-muted-foreground">
                            <p><strong>Entrada:</strong> {ejercicioActual.ejemplo.entrada}</p>
                            <p><strong>Salida esperada:</strong> {ejercicioActual.ejemplo.salida}</p>
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
                              {ejercicioActual.pista}
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
                      <Card>
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
                                  disabled={ejercicioActual?.id === 1}
                                >
                                  <ArrowLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={irSiguienteEjercicio}
                                  disabled={ejercicioActual?.id === ejercicios.length}
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
                            <Card>
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
