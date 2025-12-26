import { getExercises } from '@/lib/exercises-service'
import { ExerciseGrid } from '@/components/exercises'

export const dynamic = 'force-dynamic'

export default async function ExercisesPage() {
  const exercises = await getExercises()

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            <span className="text-primary">Ejercicios</span>
          </h1>
          <p className="text-xs text-muted-foreground/70">
            {exercises.length} ejercicios disponibles
          </p>
        </div>
      </div>

      <ExerciseGrid exercises={exercises} />
    </div>
  )
}

