'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Database } from 'lucide-react'
import { SqlDemoAnimation } from './sql-demo-animation'
import { CrafterStationLogo } from '@/components/logos/crafter-station'
import { GithubLogo } from '@/components/logos/github'

export function LandingPage() {

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20 overflow-hidden">
        {/* Background fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/15 via-primary/5 to-transparent pointer-events-none" />
        
        {/* Decorative blurred ellipses */}
        <div 
          className="absolute pointer-events-none bg-primary rounded-full"
          style={{
            width: 367,
            height: 367,
            right: -100,
            top: -168,
            mixBlendMode: 'hard-light',
            filter: 'blur(350px)',
            opacity: 0.6,
          }}
        />
        <div 
          className="absolute pointer-events-none bg-primary rounded-full"
          style={{
            width: 367,
            height: 367,
            left: -150,
            top: 808,
            mixBlendMode: 'hard-light',
            filter: 'blur(350px)',
            opacity: 0.4,
          }}
        />
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full">
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-3"
        >
          {/* Logo/Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-4 flex justify-center"
          >
            <motion.div 
              className="relative w-14 h-14 md:w-16 md:h-16"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg" />
              <div className="stellar-border w-full h-full rounded-xl">
                <div className="stellar-border-inner bg-gradient-to-br from-primary/10 to-primary/5" />
                <div className="relative flex items-center justify-center w-full h-full">
                  <Database className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                </div>
              </div>
            </motion.div>
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
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4"
          >
            Domina SQL paso a paso con ejercicios prácticos y retroalimentación inmediata.
            Desde conceptos básicos hasta consultas avanzadas.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-8"
          >
            <Database className="h-4 w-4" />
            <span>Aprende SQL con <strong className="text-foreground">PostgreSQL</strong></span>
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
        </div>
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
                  className="h-5 w-auto dark:invert-0 invert"
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

