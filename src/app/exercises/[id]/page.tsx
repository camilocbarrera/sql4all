import { notFound } from "next/navigation";
import { ExerciseView } from "@/components/exercises";
import {
  getExerciseById,
  getExerciseContext,
  getExercises,
} from "@/lib/exercises-service";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const exercise = await getExerciseById(id);

  return {
    title: exercise ? `${exercise.title} - SQL4All` : "Ejercicio no encontrado",
  };
}

export async function generateStaticParams() {
  try {
    const exercises = await getExercises();
    return exercises.map((exercise) => ({ id: exercise.id }));
  } catch {
    // Return empty array if database is unavailable (e.g., during CI build)
    return [];
  }
}

export default async function ExercisePage({ params }: PageProps) {
  const { id } = await params;
  const exercise = await getExerciseById(id);

  if (!exercise) {
    notFound();
  }

  const context = await getExerciseContext(id);

  return (
    <ExerciseView
      exercise={exercise}
      nextExerciseId={context?.nextExercise?.id}
      prevExerciseId={context?.prevExercise?.id}
      currentIndex={context?.currentIndex}
      totalExercises={context?.totalExercises}
    />
  );
}
