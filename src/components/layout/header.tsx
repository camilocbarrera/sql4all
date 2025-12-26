'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Menu, User, Star } from 'lucide-react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import {
  Button,
  Separator,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui'
import { UserProfile } from '@/components/auth/user-profile'
import { ScoreBadge } from '@/components/shared/score-badge'
import { StreakBadge } from '@/components/shared/streak-badge'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { CrafterStationLogo } from '@/components/logos/crafter-station'
import { GithubLogo } from '@/components/logos/github'

export function Header() {
  const { user, isLoaded: isClerkLoaded } = useUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [githubStars, setGithubStars] = useState<number | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // Only show user-specific UI after Clerk has loaded
  const showUserUI = isClerkLoaded && !!user

  useEffect(() => {
    const fetchGithubStars = async () => {
      try {
        const response = await fetch(
          'https://api.github.com/repos/camilocbarrera/sql4all'
        )
        if (response.ok) {
          const data = await response.json()
          setGithubStars(data.stargazers_count)
        }
      } catch (error) {
        console.warn('Failed to fetch GitHub stars:', error)
      }
    }
    fetchGithubStars()
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4">
        <div className="flex items-center gap-2 md:gap-4">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight hover:text-primary transition-colors"
          >
            sql4All
          </Link>
          <Separator orientation="vertical" className="h-6 hidden md:block" />
          <nav className="hidden md:flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="flex items-center gap-2"
            >
              <Link href="/docs">
                <BookOpen className="h-4 w-4" />
                Documentación
              </Link>
            </Button>
            {showUserUI && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="flex items-center gap-2"
              >
                <Link href="/profile">
                  <User className="h-4 w-4" />
                  Perfil
                </Link>
              </Button>
            )}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://www.crafterstation.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:opacity-80 transition-opacity"
              aria-label="Crafter Station"
            >
              <CrafterStationLogo className="h-5 w-auto" />
            </a>
            <div className="h-4 w-px bg-border" />
            <a
              href="https://github.com/camilocbarrera/sql4all"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-muted/50 hover:bg-muted transition-colors"
              aria-label="GitHub"
            >
              <GithubLogo className="h-4 w-auto" variant="invertocat" />
              {githubStars !== null && (
                <span className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  {githubStars}
                </span>
              )}
            </a>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <StreakBadge />
            <ScoreBadge />
          </div>
          
          <ThemeToggle />

          <div className="hidden sm:block">
            <UserProfile />
          </div>

          {/* Mobile Menu - Only render after mount to avoid hydration mismatch */}
          {isMounted ? (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Menú</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  {showUserUI && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <StreakBadge />
                      <ScoreBadge />
                    </div>
                  )}
                  
                  <nav className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      className="justify-start"
                      asChild
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link href="/">
                        Ejercicios
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      asChild
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link href="/docs">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Documentación
                      </Link>
                    </Button>
                    {showUserUI && (
                      <Button
                        variant="ghost"
                        className="justify-start"
                        asChild
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Link href="/profile">
                          <User className="h-4 w-4 mr-2" />
                          Mi Perfil
                        </Link>
                      </Button>
                    )}
                  </nav>

                  <Separator />

                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-muted-foreground px-2">Enlaces</p>
                    <Button variant="ghost" className="justify-start" asChild>
                      <a
                        href="https://www.crafterstation.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <CrafterStationLogo className="h-4 w-auto mr-2" />
                        Crafter Station
                      </a>
                    </Button>
                    <Button variant="ghost" className="justify-between w-full" asChild>
                      <a
                        href="https://github.com/camilocbarrera/sql4all"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="flex items-center">
                          <GithubLogo className="h-4 w-auto mr-2" variant="invertocat" />
                          GitHub
                        </span>
                        {githubStars !== null && (
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                            {githubStars}
                          </span>
                        )}
                      </a>
                    </Button>
                  </div>

                  <Separator />

                  <div className="sm:hidden">
                    <UserProfile />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menú</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

