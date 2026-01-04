"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client";
import { type Exercise, exercisesResponseSchema } from "@/lib/validations";

async function fetchExercises(): Promise<Exercise[]> {
  const res = await fetch("/api/exercises", {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch exercises");
  }

  const data = await res.json();
  const parsed = exercisesResponseSchema.parse(data);
  return parsed.exercises;
}

async function fetchExercise(id: string): Promise<Exercise> {
  const res = await fetch(`/api/exercises/${id}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch exercise");
  }

  const data = await res.json();
  return data.exercise;
}

export function useExercises() {
  return useQuery({
    queryKey: queryKeys.exercises,
    queryFn: fetchExercises,
  });
}

export function useExercise(id: string) {
  return useQuery({
    queryKey: queryKeys.exercise(id),
    queryFn: () => fetchExercise(id),
    enabled: !!id,
  });
}
