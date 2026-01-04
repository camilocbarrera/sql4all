"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { ArrowRight, Save } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";

interface SignupPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip: () => void;
}

export function SignupPromptModal({
  isOpen,
  onClose,
  onSkip,
}: SignupPromptModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Save className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center pt-2">
            Guarda tu progreso
          </DialogTitle>
          <DialogDescription className="text-center">
            Has completado tu primer ejercicio. Crea una cuenta para guardar tu
            progreso y continuar donde lo dejaste.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-4">
          <SignUpButton mode="modal">
            <Button className="w-full">
              Crear cuenta
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </SignUpButton>
          <SignInButton mode="modal">
            <Button variant="outline" className="w-full">
              Ya tengo cuenta
            </Button>
          </SignInButton>
        </div>
        <DialogFooter className="sm:justify-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="text-muted-foreground"
          >
            Continuar sin cuenta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
