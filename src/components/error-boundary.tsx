'use client'

import React from 'react'
import { AlertCircle } from 'lucide-react'
import { handleSQLError } from '@/lib/sql-error-handler'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: string | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  }

  public static getDerivedStateFromError(error: Error): State {
    // Actualizar el estado para que el siguiente render muestre la UI alternativa
    return { 
      hasError: true, 
      error,
      errorInfo: null
    }
  }

  public componentDidCatch(error: Error) {
    console.error('Error capturado:', error)
    
    if (error.stack?.includes('@electric-sql/pglite')) {
      const formattedError = handleSQLError({
        message: error.message,
        stack: error.stack
      })
      
      this.setState({
        errorInfo: formattedError.message
      })
    } else {
      this.setState({
        errorInfo: 'Ocurrió un error inesperado. Por favor, intenta de nuevo.'
      })
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-start gap-2 text-red-500 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md m-4">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <div>
            <p className="font-semibold">Error en la consulta SQL</p>
            <p className="text-sm">{this.state.errorInfo}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
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
