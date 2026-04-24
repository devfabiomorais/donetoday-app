type Exercise = {
  id: string
  name: string
  muscleGroups: string[]
  metricType: string
}

type RoutineStore = {
  selectedExercises: Exercise[]
  setSelectedExercises: (exercises: Exercise[]) => void
}

let store: RoutineStore = {
  selectedExercises: [],
  setSelectedExercises: (exercises) => {
    store.selectedExercises = exercises
    listeners.forEach((listener) => listener())
  },
}

const listeners = new Set<() => void>()

export function useRoutineStore(): RoutineStore & { subscribe: (fn: () => void) => () => void } {
  return {
    ...store,
    subscribe: (fn) => {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
  }
}

export const routineStore = store