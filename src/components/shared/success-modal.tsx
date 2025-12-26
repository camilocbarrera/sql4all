'use client'

import { useRouter } from 'next/navigation'
import { PartyPopper, ArrowRight, Home } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Button,
} from '@/components/ui'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  exerciseTitle: string
  nextExerciseId?: string
}

export function SuccessModal({
  isOpen,
  onClose,
  exerciseTitle,
  nextExerciseId,
}: SuccessModalProps) {
  const router = useRouter()

  const handleNextExercise = () => {
    if (nextExerciseId) {
      router.push(`/exercises/${nextExerciseId}`)
      onClose()
    }
  }

  const handleGoHome = () => {
    router.push('/')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <PartyPopper className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <DialogTitle className="text-center">
            ¡Progreso Guardado!
          </DialogTitle>
          <DialogDescription className="text-center">
            Has completado exitosamente &quot;{exerciseTitle}&quot;
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-4">
          {nextExerciseId && (
            <Button onClick={handleNextExercise} className="w-full">
              Siguiente ejercicio
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          <Button variant="outline" onClick={handleGoHome} className="w-full">
            <Home className="mr-2 h-4 w-4" />
            Volver al inicio
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}


