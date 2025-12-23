import { getExercises } from '@/lib/exercises-service'
import { ExerciseGrid } from '@/components/exercises'

export const dynamic = 'force-dynamic'

export default async function ExercisesPage() {
  const exercises = await getExercises()

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Ejercicios de <span className="text-primary">SQL</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Selecciona un ejercicio para comenzar. Progresa desde lo básico
          hasta consultas avanzadas.
        </p>
      </div>

      <ExerciseGrid exercises={exercises} />
    </div>
  )
}

