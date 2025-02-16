import { supabase } from './supabase'

export type Exercise = {
  id: string
  title: string
  difficulty: string
  description: string
  details: string
  hint: string
  success_message: string
  example: {
    entrada?: string
    salida?: string
  }
  validation: {
    type: 'exact' | 'partial'
    conditions: any
  }
  created_at?: string
  updated_at?: string
}

export async function getExercises() {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('is_deleted', false)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching exercises:', error)
    throw error
  }

  return data as Exercise[]
}

export async function getExerciseById(id: string) {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('id', id)
    .eq('is_deleted', false)
    .single()

  if (error) {
    console.error('Error fetching exercise:', error)
    throw error
  }

  return data as Exercise
}

export async function createSubmission(exerciseId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .insert([
        {
          exercise_id: exerciseId,
          user_id: userId,
          score: 2, // Default score as specified
          feedback: null,
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating submission:', error);
    return { data: null, error };
  }
}

export async function getTotalScore(userId: string) {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('exercise_id, score')
      .eq('user_id', userId);

    if (error) throw error;

    // Create a map to store the highest score for each exercise
    const exerciseScores = new Map<string, number>();
    data.forEach(submission => {
      const currentScore = exerciseScores.get(submission.exercise_id) || 0;
      exerciseScores.set(submission.exercise_id, Math.max(currentScore, submission.score || 0));
    });

    // Sum up the highest scores for each exercise
    const totalScore = Array.from(exerciseScores.values()).reduce((sum, score) => sum + score, 0);
    return { data: totalScore, error: null };
  } catch (error) {
    console.error('Error fetching total score:', error);
    return { data: 0, error };
  }
}

export async function getStreak(userId: string) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data, error } = await supabase
      .from('submissions')
      .select('created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) return { data: 0, error: null };

    let streak = 0;
    const submissions = data.map(sub => {
      const date = new Date(sub.created_at);
      date.setHours(0, 0, 0, 0);
      return date;
    });

    // Check if user has submitted today
    const hasSubmittedToday = submissions.some(date => date.getTime() === today.getTime());
    if (!hasSubmittedToday) {
      // Check if last submission was yesterday to maintain streak
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (!submissions.some(date => date.getTime() === yesterday.getTime())) {
        return { data: 0, error: null };
      }
    }

    // Calculate streak
    const startDate = hasSubmittedToday ? today : new Date(submissions[0]);
    const checkDate = new Date(startDate);
    while (true) {
      const submissionExists = submissions.some(date => date.getTime() === checkDate.getTime());
      if (!submissionExists) break;
      
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return { data: streak, error: null };
  } catch (error) {
    console.error('Error calculating streak:', error);
    return { data: 0, error };
  }
}

export async function getWeekProgress(userId: string) {
  try {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('submissions')
      .select('created_at')
      .eq('user_id', userId)
      .gte('created_at', startOfWeek.toISOString());

    if (error) throw error;

    const daysWithSubmissions = new Set(
      data.map(sub => {
        const date = new Date(sub.created_at);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      })
    );

    const weekProgress = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekProgress.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: daysWithSubmissions.has(date.getTime())
      });
    }

    return { data: weekProgress, error: null };
  } catch (error) {
    console.error('Error fetching week progress:', error);
    return { data: [], error };
  }
}

export async function getSolvedExercises(userId: string) {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('exercise_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Create a Set of solved exercise IDs for efficient lookup
    const solvedExerciseIds = new Set(data.map(sub => sub.exercise_id));
    return { data: solvedExerciseIds, error: null };
  } catch (error) {
    console.error('Error fetching solved exercises:', error);
    return { data: new Set(), error };
  }
}

const difficultyOrder = ['Principiante', 'Intermedio', 'Avanzado'] as const;

export async function getNextExercise(currentExerciseId: string): Promise<{ data: Exercise | null, error: any }> {
  try {
    // Get current exercise to know its difficulty
    const currentExercise = await getExerciseById(currentExerciseId);
    
    // Get all exercises
    const { data: exercises, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Group exercises by difficulty
    const groupedExercises = exercises.reduce((acc: Record<string, Exercise[]>, exercise) => {
      if (!acc[exercise.difficulty]) {
        acc[exercise.difficulty] = [];
      }
      acc[exercise.difficulty].push(exercise);
      return acc;
    }, {});

    // Find current exercise index in its difficulty group
    const currentDifficultyExercises = groupedExercises[currentExercise.difficulty] || [];
    const currentIndex = currentDifficultyExercises.findIndex(ex => ex.id === currentExerciseId);

    // If there's a next exercise in the same difficulty
    if (currentIndex < currentDifficultyExercises.length - 1) {
      return { data: currentDifficultyExercises[currentIndex + 1], error: null };
    }

    // If we need to move to the next difficulty
    const currentDifficultyIndex = difficultyOrder.indexOf(currentExercise.difficulty as any);
    if (currentDifficultyIndex < difficultyOrder.length - 1) {
      const nextDifficulty = difficultyOrder[currentDifficultyIndex + 1];
      const nextDifficultyExercises = groupedExercises[nextDifficulty] || [];
      if (nextDifficultyExercises.length > 0) {
        return { data: nextDifficultyExercises[0], error: null };
      }
    }

    // No next exercise found
    return { data: null, error: null };
  } catch (error) {
    console.error('Error getting next exercise:', error);
    return { data: null, error };
  }
} 