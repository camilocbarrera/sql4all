'use client'

import { Button } from "@/components/ui/button"
import { useTheme } from 'next-themes'
import { Moon, Sun, Github, BookOpen, Linkedin, Coffee } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import Link from 'next/link'
import { Profile } from './auth/Profile'
import { ScoreBadge, ScoreBadgeRef, setScoreBadgeRef } from './score-badge'
import { StreakBadge, StreakBadgeRef, setStreakBadgeRef } from './streak-badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRef, useEffect } from 'react'

export function Header() {
  const { theme, setTheme } = useTheme()
  const scoreBadgeRef = useRef<ScoreBadgeRef>(null)
  const streakBadgeRef = useRef<StreakBadgeRef>(null)

  useEffect(() => {
    setScoreBadgeRef(scoreBadgeRef.current)
    setStreakBadgeRef(streakBadgeRef.current)
  }, [])

  return (
    <header className="p-4 flex justify-between items-center border-b border-border/40 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center gap-2 md:gap-4">
        <Link href="/" className="text-xl md:text-2xl font-bold hover:text-primary transition-colors">
          sql4All
        </Link>
        <Separator orientation="vertical" className="h-6 hidden md:block" />
        <nav className="flex items-center gap-2 md:gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2">
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
      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://github.com/camilocbarrera/sql4all"
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
        </div>
        <div className="flex items-center gap-2">
          <StreakBadge ref={streakBadgeRef} />
          <ScoreBadge ref={scoreBadgeRef} />
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </div>
        <div className="relative z-50">
          <Profile />
        </div>
      </div>
    </header>
  )
} 