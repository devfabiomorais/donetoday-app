import api from './api';

export async function startWorkout(data: { name: string; routineId?: string }) {
  const { data: response } = await api.post('/workouts/start', data)
  return response
}

export async function saveWorkout(id: string, data: {
  notes?: string
  sets: Array<{
    exerciseId: string
    setNumber: number
    weight?: number
    reps?: number
    duration?: number
    setType: string
    completed: boolean
  }>
}) {
  const { data: response } = await api.post(`/workouts/${id}/save`, data)
  return response
}

export async function getWorkouts() {
  const { data } = await api.get('/workouts')
  return data
}

export async function getLastSets(exerciseId: string, routineId?: string) {
  const params = routineId ? `?routineId=${routineId}` : ''
  const { data } = await api.get(`/workouts/history/${exerciseId}${params}`)
  return data
}