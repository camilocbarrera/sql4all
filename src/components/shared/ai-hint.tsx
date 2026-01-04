"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2, RefreshCw, Sparkles, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import Markdown from "react-markdown";
import { Button } from "@/components/ui";

interface ExerciseContext {
  title: string;
  description: string;
  details: string;
  hint: string;
  type?: "dml" | "ddl";
}

interface AIHintProps {
  exercise: ExerciseContext;
  userQuery: string;
  error: string;
  schema?: string;
}

export function AIHint({ exercise, userQuery, error, schema }: AIHintProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [completion, setCompletion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchHint = useCallback(
    async (previousHint?: string) => {
      setIsLoading(true);
      setCompletion("");

      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch("/api/ai/hint", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            exercise,
            userQuery,
            error,
            schema,
            previousHint,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) throw new Error("Failed to fetch hint");
        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setCompletion((prev) => prev + chunk);
        }
        setHintCount((prev) => prev + 1);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("AI hint error:", err);
          setCompletion("Error al generar la pista. Intenta de nuevo.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [exercise, userQuery, error, schema],
  );

  const requestHint = useCallback(async () => {
    if (completion && !isLoading) {
      setIsVisible(true);
      return;
    }
    setIsVisible(true);
    await fetchHint();
  }, [completion, isLoading, fetchHint]);

  const requestBetterHint = useCallback(async () => {
    if (isLoading) return;
    await fetchHint(completion);
  }, [isLoading, completion, fetchHint]);

  const dismiss = useCallback(() => {
    setIsVisible(false);
  }, []);

  if (!isVisible) {
    return (
      <motion.button
        type="button"
        onClick={requestHint}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mt-3 group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Sparkles className="h-3.5 w-3.5 text-amber-500 group-hover:text-amber-400" />
        <span>Obtener pista con IA</span>
      </motion.button>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.2 }}
        className="mt-3"
      >
        <div className="relative p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                  Pista IA
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 -mr-1 -mt-1"
                  onClick={dismiss}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              {isLoading && !completion ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Analizando tu consulta...</span>
                </div>
              ) : (
                <>
                  <div className="text-sm text-foreground/90 leading-relaxed prose prose-sm dark:prose-invert prose-p:my-1 prose-code:bg-amber-500/20 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-amber-700 dark:prose-code:text-amber-300 prose-code:before:content-none prose-code:after:content-none max-w-none">
                    <Markdown>{completion || "Generando pista..."}</Markdown>
                  </div>
                  {completion && !isLoading && hintCount < 3 && (
                    <button
                      type="button"
                      onClick={requestBetterHint}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors mt-2 group"
                    >
                      <RefreshCw className="h-3 w-3 group-hover:rotate-180 transition-transform duration-300" />
                      <span>Explica mejor</span>
                    </button>
                  )}
                  {isLoading && completion && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Generando mejor explicación...</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
