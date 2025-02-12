import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog"
import { Badge } from "./badge"
import { Button } from "./button"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  LinkedinShareButton,
  LinkedinIcon,
  TwitterShareButton,
  TwitterIcon
} from 'next-share'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  exerciseTitle: string
  nextExerciseId?: string
}

export function SuccessModal({ isOpen, onClose, exerciseTitle, nextExerciseId }: SuccessModalProps) {
  const router = useRouter()
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = `¡He completado el ejercicio "${exerciseTitle}" en SQL4All! 🎉 #SQL #Learning`

  const handleNextExercise = () => {
    if (nextExerciseId) {
      router.push(`/exercises/${nextExerciseId}`)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">¡Ejercicio Completado! 🎉</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <Badge className="bg-green-500 hover:bg-green-600">
            Progreso Guardado
          </Badge>
          
          <p className="text-center text-sm text-muted-foreground">
            ¡Has completado el ejercicio exitosamente! Comparte tu logro o continúa con el siguiente ejercicio.
          </p>

          <div className="flex gap-4 items-center justify-center">
            <TwitterShareButton
              url={shareUrl}
              title={shareText}
              blankTarget
            >
              <div className="flex flex-col items-center gap-1">
                <TwitterIcon size={32} round />
                <span className="text-xs text-muted-foreground">X (Twitter)</span>
              </div>
            </TwitterShareButton>

            <LinkedinShareButton
              url={shareUrl}
              title={exerciseTitle}
              summary={shareText}
              blankTarget
            >
              <div className="flex flex-col items-center gap-1">
                <LinkedinIcon size={32} round />
                <span className="text-xs text-muted-foreground">LinkedIn</span>
              </div>
            </LinkedinShareButton>
          </div>

          {nextExerciseId && (
            <Button className="w-full mt-4" onClick={handleNextExercise}>
              Siguiente Ejercicio
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 