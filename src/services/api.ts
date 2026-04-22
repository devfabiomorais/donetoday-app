import axios, { InternalAxiosRequestConfig } from 'axios'
import * as SecureStore from 'expo-secure-store'

const api = axios.create({
  baseURL: 'https://donetoday-api-production.up.railway.app',
})

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await SecureStore.getItemAsync('donetoday_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api