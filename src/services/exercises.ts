import api from './api'

export async function getExercises() {
  const { data } = await api.get('/exercises')
  return data
}

export async function getMyExercises() {
  const { data } = await api.get('/exercises/me')
  return data
}