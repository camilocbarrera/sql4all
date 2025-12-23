'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export function GithubBadge() {
  const [githubStars, setGithubStars] = useState<number | null>(null)
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const starRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const fetchGithubStars = async () => {
      try {
        const response = await fetch(
          'https://api.github.com/repos/camilocbarrera/sql4all'
        )
        if (response.ok) {
          const data = await response.json()
          setGithubStars(data.stargazers_count)
          setTimeout(() => setShouldAnimate(true), 100)
        }
      } catch (error) {
        console.warn('Failed to fetch GitHub stars:', error)
      }
    }
    fetchGithubStars()
  }, [])

  return (
    <>
      <motion.a
        href="https://github.com/camilocbarrera/sql4all"
        target="_blank"
        rel="noopener noreferrer"
        className="github-badge fixed top-[80px] right-4 md:top-[72px] md:right-6 z-50 flex items-center gap-2.5 px-4 py-2 md:px-5 md:py-2.5 bg-black/40 dark:bg-white/10 backdrop-blur-sm border border-white/10 dark:border-white/20 rounded-md opacity-60 hover:opacity-100 transition-opacity duration-300 group"
        style={{ pointerEvents: 'auto' }}
        initial={{ x: 0, opacity: 0.6 }}
        animate={shouldAnimate ? { x: -20, opacity: 0.6 } : { x: 0, opacity: 0.6 }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 15,
        }}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
          <path d="M9 18c-4.51 2-5-2-7-2"></path>
        </motion.svg>

        {githubStars !== null && shouldAnimate && (
          <motion.span
            className="text-white text-sm font-medium flex items-center gap-1.5"
            key={githubStars}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 120,
              damping: 15,
              delay: 0.2,
            }}
          >
            <div className="star-wrapper relative inline-block">
              <svg
                ref={starRef}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="star-icon text-yellow-400 relative"
                style={{
                  filter: 'drop-shadow(0 0 0.5px rgba(251, 191, 36, 0.2))',
                }}
              >
                <defs>
                  <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(251, 191, 36, 0.8)" />
                    <stop offset="50%" stopColor="rgba(251, 191, 36, 1)" />
                    <stop offset="100%" stopColor="rgba(251, 191, 36, 0.8)" />
                  </linearGradient>
                </defs>
                <polygon
                  points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                  fill="url(#starGradient)"
                />
              </svg>
            </div>
            {githubStars}
          </motion.span>
        )}
      </motion.a>
    </>
  )
}

