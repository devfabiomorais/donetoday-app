import api from './api'

export async function getExercises() {
  const { data } = await api.get('/exercises')
  return data
}

export async function getMyExercises() {
  const { data } = await api.get('/exercises/me')
  return data
}

export async function createExercise(payload: {
  name: string
  muscleGroups: string[]
  equipment: string[]
  exerciseTypes: string[]
  metricType: string
  imageUrl?: string
  videoUrl?: string
}) {
  const { data } = await api.post('/exercises', payload)
  return data
}