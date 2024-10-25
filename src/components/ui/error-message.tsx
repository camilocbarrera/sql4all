'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, Code } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ErrorMessageProps {
  message: string
  example?: string | null
  timestamp?: number
}

export function ErrorMessage({ message, example, timestamp }: ErrorMessageProps) {
  const [shake, setShake] = useState(false)

  useEffect(() => {
    if (timestamp) {
      setShake(true)
      const timer = setTimeout(() => setShake(false), 500)
      return () => clearTimeout(timer)
    }
  }, [timestamp])

  return (
    <div
      className={cn(
        "flex flex-col gap-2 text-red-500 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md transition-all",
        shake && "animate-shake"
      )}
      role="alert"
    >
      <div className="flex items-start gap-2">
        <AlertCircle className="h-5 w-5 mt-0.5" />
        <div>{message}</div>
      </div>
      {example && (
        <div className="mt-2 pl-7">
          <div className="flex items-center gap-2 text-xs text-red-400 dark:text-red-300 mb-1">
            <Code className="h-4 w-4" />
            <span>Ejemplo:</span>
          </div>
          <pre className="bg-red-100 dark:bg-red-900/40 p-2 rounded text-xs overflow-x-auto">
            {example}
          </pre>
        </div>
      )}
    </div>
  )
}
