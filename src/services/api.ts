import axios, { InternalAxiosRequestConfig } from 'axios'
import { router } from 'expo-router'
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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log('Erro em:', error.config?.url)
    console.log('Status:', error.response?.status)

    if (error?.response?.status === 401) {
      await SecureStore.deleteItemAsync('donetoday_token')
      await SecureStore.deleteItemAsync('donetoday_user')

      router.replace('/(auth)/login')
    }

    return Promise.reject(error)
  }
)

export default api