import { getExercises } from '@/lib/exercises-service'
import { ExercisesGrid } from '@/components/exercises-grid'

export default async function HomePage() {
  const exercises = await getExercises()

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-5xl mx-auto mt-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold dark:text-white text-gray-900 mb-4">
            Aprende SQL Interactivamente
          </h1>
          <p className="dark:text-gray-400 text-gray-600 max-w-2xl mx-auto">
            Domina SQL paso a paso con ejercicios prácticos. Desde conceptos básicos hasta consultas avanzadas.
          </p>
        </div>

        <ExercisesGrid exercises={exercises} />
      </div>
    </div>
  )
}
