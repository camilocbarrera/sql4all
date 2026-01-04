"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  CornerDownLeft,
  Loader2,
  Play,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const DEMO_QUERY = `SELECT nombre, email
FROM usuarios
WHERE activo = true
LIMIT 3;`;

const DEMO_RESULTS = [
  { nombre: "Ana García", email: "ana.garcia@email.com" },
  { nombre: "Carlos López", email: "carlos.lopez@email.com" },
  { nombre: "María Rodríguez", email: "maria.rodriguez@email.com" },
];

interface SqlDemoAnimationProps {
  className?: string;
}

type Phase =
  | "idle"
  | "typing"
  | "waiting"
  | "executing"
  | "results"
  | "success";

export function SqlDemoAnimation({ className }: SqlDemoAnimationProps) {
  const router = useRouter();
  const [displayedQuery, setDisplayedQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showRedirect, setShowRedirect] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [showKeyPress, setShowKeyPress] = useState(false);
  const [autoExecuteEnabled, setAutoExecuteEnabled] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const clearAllTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const executeQuery = useCallback(() => {
    if (phase !== "waiting") return;

    clearAllTimeouts();
    setAutoExecuteEnabled(false);
    setShowKeyPress(true);

    timeoutRef.current = setTimeout(() => {
      setShowKeyPress(false);
      setPhase("executing");

      timeoutRef.current = setTimeout(() => {
        setPhase("results");
        setShowResults(true);

        timeoutRef.current = setTimeout(() => {
          setPhase("success");
          setShowSuccess(true);

          // Show redirect message and navigate after 2 seconds
          timeoutRef.current = setTimeout(() => {
            setShowRedirect(true);
            timeoutRef.current = setTimeout(() => {
              router.push("/exercises");
            }, 1500);
          }, 800);
        }, 600);
      }, 400);
    }, 100);
  }, [phase, clearAllTimeouts, router]);

  const startAnimation = useCallback(() => {
    clearAllTimeouts();
    setDisplayedQuery("");
    setShowResults(false);
    setShowSuccess(false);
    setShowRedirect(false);
    setIsTyping(true);
    setShowKeyPress(false);
    setPhase("typing");
  }, [clearAllTimeouts]);

  // Detect if user is on Mac for keyboard hints
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().includes("MAC"));
  }, []);

  // Keyboard shortcut handler - supports Ctrl+Enter (Windows/Linux) and Cmd+Enter (Mac)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "Enter" &&
        (e.ctrlKey || e.metaKey) &&
        phase === "waiting"
      ) {
        e.preventDefault();
        executeQuery();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, executeQuery]);

  useEffect(() => {
    const initialDelay = setTimeout(startAnimation, 500);
    return () => clearTimeout(initialDelay);
  }, [startAnimation]);

  useEffect(() => {
    if (phase !== "typing") return;

    let currentIndex = 0;
    const typeInterval = setInterval(() => {
      if (currentIndex < DEMO_QUERY.length) {
        setDisplayedQuery(DEMO_QUERY.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        setPhase("waiting");

        if (autoExecuteEnabled) {
          timeoutRef.current = setTimeout(() => {
            if (phase === "typing") return;
            executeQuery();
          }, 1500);
        }
      }
    }, 18);

    return () => {
      clearInterval(typeInterval);
      clearAllTimeouts();
    };
  }, [phase, autoExecuteEnabled, executeQuery, clearAllTimeouts]);

  const isWaiting = phase === "waiting";
  const isExecuting = phase === "executing";

  const canExecute = phase === "waiting";

  return (
    <div
      ref={containerRef}
      className={cn("w-full max-w-2xl mx-auto", className)}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl border-2 border-primary/20 bg-gradient-to-b from-card/95 to-card/70 
                   backdrop-blur-xl overflow-hidden 
                   shadow-2xl shadow-primary/10 
                   ring-1 ring-white/10 dark:ring-white/5"
      >
        {/* Window Chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-primary/10 bg-muted/40">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm shadow-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm shadow-green-500/50" />
          </div>
          <span className="text-xs text-muted-foreground ml-2">
            Obtener los nombres y emails de usuarios activos (máximo 3)
          </span>
        </div>

        {/* Editor Content */}
        <div className="p-4 font-mono text-sm">
          <div className="min-h-[120px] relative">
            <pre className="text-foreground/90 whitespace-pre-wrap">
              <code>
                {displayedQuery.split("\n").map((line, i) => (
                  <span key={i} className="block">
                    {line.split(" ").map((word, j) => {
                      const keywords = [
                        "SELECT",
                        "FROM",
                        "WHERE",
                        "LIMIT",
                        "AND",
                        "OR",
                        "true",
                        "false",
                      ];
                      const isKeyword = keywords.includes(
                        word.replace(/[,;]/g, ""),
                      );
                      return (
                        <span
                          key={j}
                          className={cn(
                            isKeyword && "text-primary font-medium",
                            word.includes("=") && "text-chart-2",
                          )}
                        >
                          {word}{" "}
                        </span>
                      );
                    })}
                  </span>
                ))}
                {(isTyping || isWaiting) && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{
                      duration: 0.4,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="inline-block w-2 h-4 bg-primary ml-0.5"
                  />
                )}
              </code>
            </pre>
          </div>

          {/* Execute Button & Keyboard Hint */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <motion.button
                onClick={executeQuery}
                animate={isExecuting ? { scale: [1, 0.95, 1] } : {}}
                transition={{ duration: 0.2 }}
                className={cn(
                  "group flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isExecuting
                    ? "bg-primary/80 text-primary-foreground cursor-wait"
                    : isWaiting
                      ? "bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 shadow-lg shadow-primary/25"
                      : "bg-primary/50 text-primary-foreground/70 cursor-not-allowed",
                )}
                disabled={!canExecute}
              >
                {isExecuting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {isExecuting ? "Ejecutando..." : "Comenzar ahora"}
                {isWaiting && (
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{
                      duration: 1.2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                )}
              </motion.button>
            </div>

            {/* Keyboard Shortcut Hint */}
            <AnimatePresence mode="wait">
              {isWaiting ? (
                <motion.div
                  key="waiting-hint"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    animate={{ scale: showKeyPress ? 0.9 : 1 }}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors",
                      showKeyPress
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/80 text-foreground",
                    )}
                  >
                    <span className="font-medium">Presiona</span>
                    <kbd
                      className={cn(
                        "px-2 py-0.5 rounded text-xs font-mono transition-colors",
                        showKeyPress
                          ? "bg-primary-foreground/20"
                          : "bg-background",
                      )}
                    >
                      {isMac ? "⌘" : "Ctrl"}
                    </kbd>
                    <span>+</span>
                    <kbd
                      className={cn(
                        "px-2 py-0.5 rounded text-xs font-mono flex items-center gap-1 transition-colors",
                        showKeyPress
                          ? "bg-primary-foreground/20"
                          : "bg-background",
                      )}
                    >
                      Enter <CornerDownLeft className="w-3 h-3" />
                    </kbd>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="default-hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground"
                >
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">
                    {isMac ? "⌘" : "Ctrl"}
                  </kbd>
                  <span>+</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">
                    Enter
                  </kbd>
                  <span className="ml-1">para ejecutar</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-primary/10"
            >
              <div className="p-4 bg-gradient-to-b from-transparent to-primary/5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground/90">
                      Resultados
                    </span>
                    <span className="text-xs text-primary-foreground/80 px-2 py-0.5 bg-primary/20 rounded-full font-medium">
                      {DEMO_RESULTS.length} filas
                    </span>
                  </div>
                  <AnimatePresence>
                    {showSuccess && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8, x: 10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        ¡Correcto!
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Results Table */}
                <div className="rounded-xl border border-primary/10 overflow-hidden shadow-sm">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-primary/5">
                        <th className="px-3 py-2.5 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wide">
                          nombre
                        </th>
                        <th className="px-3 py-2.5 text-left text-xs font-semibold text-foreground/70 uppercase tracking-wide">
                          email
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {DEMO_RESULTS.map((row, i) => (
                        <motion.tr
                          key={row.email}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="border-t border-primary/5 hover:bg-primary/5 transition-colors"
                        >
                          <td className="px-3 py-2.5 text-foreground font-medium">
                            {row.nombre}
                          </td>
                          <td className="px-3 py-2.5 text-muted-foreground">
                            {row.email}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Redirect Section */}
        <AnimatePresence>
          {showRedirect && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-primary/10 bg-gradient-to-r from-emerald-500/10 via-primary/15 to-emerald-500/10"
            >
              <div className="p-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center justify-center gap-3"
                >
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-foreground/80 font-medium">
                    ¡Así de fácil! Llevándote a los ejercicios...
                  </span>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
