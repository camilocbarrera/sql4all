'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

const DEMO_QUERY = `SELECT nombre, email
FROM usuarios
WHERE activo = true
LIMIT 3;`

const DEMO_RESULTS = [
  { nombre: 'Ana García', email: 'ana.garcia@email.com' },
  { nombre: 'Carlos López', email: 'carlos.lopez@email.com' },
  { nombre: 'María Rodríguez', email: 'maria.rodriguez@email.com' },
]

interface SqlDemoAnimationProps {
  className?: string
}

export function SqlDemoAnimation({ className }: SqlDemoAnimationProps) {
  const [displayedQuery, setDisplayedQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [phase, setPhase] = useState<'idle' | 'typing' | 'executing' | 'results' | 'success'>('idle')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const startAnimation = () => {
    setDisplayedQuery('')
    setShowResults(false)
    setShowSuccess(false)
    setIsTyping(true)
    setPhase('typing')
  }

  useEffect(() => {
    const initialDelay = setTimeout(startAnimation, 1000)
    return () => clearTimeout(initialDelay)
  }, [])

  useEffect(() => {
    if (phase !== 'typing') return

    let currentIndex = 0
    const typeInterval = setInterval(() => {
      if (currentIndex < DEMO_QUERY.length) {
        setDisplayedQuery(DEMO_QUERY.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(typeInterval)
        setIsTyping(false)
        setPhase('executing')

        timeoutRef.current = setTimeout(() => {
          setPhase('results')
          setShowResults(true)

          timeoutRef.current = setTimeout(() => {
            setPhase('success')
            setShowSuccess(true)

            timeoutRef.current = setTimeout(() => {
              startAnimation()
            }, 4000)
          }, 1500)
        }, 800)
      }
    }, 50)

    return () => {
      clearInterval(typeInterval)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [phase])

  return (
    <div className={cn('w-full max-w-2xl mx-auto', className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-xl shadow-primary/5"
      >
        {/* Window Chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
            <div className="w-3 h-3 rounded-full bg-green-400/80" />
          </div>
          <span className="text-xs text-muted-foreground font-mono ml-2"></span>
        </div>

        {/* Editor Content */}
        <div className="p-4 font-mono text-sm">
          <div className="min-h-[120px] relative">
            <pre className="text-foreground/90 whitespace-pre-wrap">
              <code>
                {displayedQuery.split('\n').map((line, i) => (
                  <span key={i} className="block">
                    {line.split(' ').map((word, j) => {
                      const keywords = ['SELECT', 'FROM', 'WHERE', 'LIMIT', 'AND', 'OR', 'true', 'false']
                      const isKeyword = keywords.includes(word.replace(/[,;]/g, ''))
                      return (
                        <span
                          key={j}
                          className={cn(
                            isKeyword && 'text-primary font-medium',
                            word.includes('=') && 'text-chart-2'
                          )}
                        >
                          {word}{' '}
                        </span>
                      )
                    })}
                  </span>
                ))}
                {isTyping && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                    className="inline-block w-2 h-4 bg-primary ml-0.5"
                  />
                )}
              </code>
            </pre>
          </div>

          {/* Execute Button */}
          <div className="mt-4 flex items-center gap-3">
            <motion.button
              animate={phase === 'executing' ? { scale: [1, 0.95, 1] } : {}}
              transition={{ duration: 0.3 }}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                phase === 'executing'
                  ? 'bg-primary/80 text-black dark:text-white'
                  : 'bg-primary text-black dark:text-white'
              )}
              disabled
            >
              <Play className="w-4 h-4" />
              {phase === 'executing' ? 'Ejecutando...' : 'Ejecutar'}
            </motion.button>
            <span className="text-xs text-muted-foreground">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Enter</kbd>
            </span>
          </div>
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border/50"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground/80">Resultados</span>
                  <AnimatePresence>
                    {showSuccess && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ¡Correcto!
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Results Table */}
                <div className="rounded-lg border border-border/50 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/30">
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">nombre</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DEMO_RESULTS.map((row, i) => (
                        <motion.tr
                          key={row.email}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="border-t border-border/30"
                        >
                          <td className="px-3 py-2 text-foreground/90">{row.nombre}</td>
                          <td className="px-3 py-2 text-muted-foreground">{row.email}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

