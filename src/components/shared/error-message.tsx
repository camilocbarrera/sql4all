"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { AIHint } from "./ai-hint";

interface ExerciseContext {
  title: string;
  description: string;
  details: string;
  hint: string;
  type?: "dml" | "ddl";
}

interface ErrorMessageProps {
  message: string;
  example?: string | null;
  timestamp?: number;
  exercise?: ExerciseContext;
  userQuery?: string;
}

export function ErrorMessage({
  message,
  example,
  timestamp,
  exercise,
  userQuery,
}: ErrorMessageProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={timestamp}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div className="space-y-2 flex-1">
                <p className="text-sm font-medium text-destructive">
                  {message}
                </p>
                {example && (
                  <div className="flex items-start gap-2 mt-3 p-3 rounded-lg bg-muted/50">
                    <Lightbulb className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Ejemplo:
                      </p>
                      <code className="text-xs font-mono bg-background px-2 py-1 rounded">
                        {example}
                      </code>
                    </div>
                  </div>
                )}
                {exercise && userQuery && (
                  <AIHint
                    exercise={exercise}
                    userQuery={userQuery}
                    error={message}
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
