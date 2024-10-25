'use client'

import { useEffect } from 'react'

interface Props {
  children: React.ReactNode
}

export function SQLErrorWrapper({ children }: Props) {
  useEffect(() => {
    const originalOnError = window.onerror

    window.onerror = (message, source, lineno, colno, error) => {
      if (source?.includes('@electric-sql/pglite')) {
        return true
      }

      if (originalOnError) {
        return originalOnError(message, source, lineno, colno, error)
      }
      return false
    }

    return () => {
      window.onerror = originalOnError
    }
  }, [])

  return <>{children}</>
}
