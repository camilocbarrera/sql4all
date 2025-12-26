'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Database } from 'lucide-react'
import { Button } from '@/components/ui'
import { SqlDemoAnimation } from './sql-demo-animation'
import { CrafterStationLogo } from '@/components/logos/crafter-station'
import { GithubLogo } from '@/components/logos/github'

export function LandingPage() {

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          {/* Logo/Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 flex justify-center"
          >
            <div className="relative w-20 h-20 md:w-24 md:h-24">
              <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl" />
              <div className="relative flex items-center justify-center w-full h-full rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <Database className="w-10 h-10 md:w-12 md:h-12 text-primary" />
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            Aprende SQL{' '}
            <span className="text-primary">Interactivamente</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Domina SQL paso a paso con ejercicios prácticos y retroalimentación inmediata.
            Desde conceptos básicos hasta consultas avanzadas.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button asChild size="lg" className="text-base px-8">
              <Link href="/exercises">
                Comenzar
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="text-base">
              <Link href="/docs">
                Ver documentación
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Interactive Demo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="w-full max-w-3xl mx-auto"
        >
          <SqlDemoAnimation />
        </motion.div>
      </section>

      {/* Footer - Powered by */}
      <footer className="py-8 px-4 border-t border-border/40">
        <div className="max-w-4xl mx-auto">
          {/* Powered by PGlite */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Powered by</span>
              <a
                href="https://pglite.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <Image
                  src="https://pglite.dev/img/brand/logo.svg"
                  alt="PGlite"
                  width={80}
                  height={20}
                  className="h-5 w-auto"
                />
              </a>
            </div>

            {/* Credits */}
            <div className="flex items-center gap-6 text-muted-foreground/60">
              <a
                href="https://www.crafterstation.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                aria-label="Crafter Station"
              >
                <CrafterStationLogo className="h-5 w-auto" />
              </a>
              <div className="h-4 w-px bg-border" />
              <a
                href="https://github.com/camilocbarrera/sql4all"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                aria-label="GitHub"
              >
                <GithubLogo
                  className="h-5 w-auto"
                  variant="invertocat"
                />
              </a>
            </div>

            <p className="text-xs text-muted-foreground/40">
              © {new Date().getFullYear()} sql4All. Aprende SQL de forma interactiva.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}

