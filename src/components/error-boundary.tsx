'use client'

import React from 'react'
import { AlertCircle } from 'lucide-react'
import { handleSQLError } from '@/lib/sql-error-handler'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
  errorMessage: string | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    errorMessage: null
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { 
      hasError: true, 
      error
    }
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by boundary:', error)
    console.error('Error info:', errorInfo)
    
    let errorMessage: string
    
    if (error.stack?.includes('@electric-sql/pglite')) {
      const formattedError = handleSQLError({
        message: error.message,
        stack: error.stack
      })
      errorMessage = formattedError.message
    } else if (error instanceof Error) {
      errorMessage = error.message || 'An unexpected error occurred'
    } else {
      errorMessage = 'Ocurrió un error inesperado. Por favor, intenta de nuevo.'
    }

    this.setState({
      errorInfo: errorInfo,
      errorMessage
    })
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorMessage: null
    })
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex items-start gap-2 text-red-500 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md m-4">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <div>
            <p className="font-semibold">Error en la consulta SQL</p>
            <p className="text-sm">{this.state.errorMessage}</p>
            <button
              onClick={this.handleReset}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
