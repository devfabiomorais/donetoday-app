import api from './api'

export async function getRoutines() {
  const { data } = await api.get('/routines/me')
  return data
}

export async function createRoutine(payload: {
  name: string
  description?: string
  isPublic: boolean
  exercises: Array<{
    exerciseId: string
    order: number
    sets: number
    restSeconds: number
  }>
}) {
  const { data } = await api.post('/routines', payload)
  return data
}

export async function deleteRoutine(id: string) {
  await api.delete(`/routines/${id}`)
}