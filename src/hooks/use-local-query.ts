"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_PREFIX = "sql4all_query_";

interface UseLocalQueryOptions {
  savedSolution?: string | null;
}

export function useLocalQuery(
  exerciseId: string,
  options?: UseLocalQueryOptions,
) {
  const storageKey = `${STORAGE_PREFIX}${exerciseId}`;
  const savedSolution = options?.savedSolution;

  const [query, setQueryState] = useState<string>("");
  const [isHydrated, setIsHydrated] = useState(false);
  const initializedRef = useRef(false);

  // Load from localStorage or saved solution on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (initializedRef.current) return;

    const stored = localStorage.getItem(storageKey);
    if (stored) {
      // Local draft takes priority
      setQueryState(stored);
    } else if (savedSolution) {
      // Fall back to saved solution from server
      setQueryState(savedSolution);
    }

    initializedRef.current = true;
    setIsHydrated(true);
  }, [storageKey, savedSolution]);

  // Save to localStorage when query changes
  const setQuery = useCallback(
    (value: string) => {
      setQueryState(value);
      if (typeof window !== "undefined") {
        if (value.trim()) {
          localStorage.setItem(storageKey, value);
        } else {
          localStorage.removeItem(storageKey);
        }
      }
    },
    [storageKey],
  );

  // Clear from localStorage (call on successful submission)
  const clearQuery = useCallback(() => {
    setQueryState("");
    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  return {
    query,
    setQuery,
    clearQuery,
    isHydrated,
  };
}
