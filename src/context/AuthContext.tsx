import * as SecureStore from 'expo-secure-store'
import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextProps {
  user: User | null
  token: string | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
}

const AuthContext = createContext({} as AuthContextProps)

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStoredAuth()
  }, [])

  async function loadStoredAuth() {
    try {
      const storedToken = await SecureStore.getItemAsync('donetoday_token')
      const storedUser = await SecureStore.getItemAsync('donetoday_user')
      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function signIn(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password })
    await SecureStore.setItemAsync('donetoday_token', data.token)
    await SecureStore.setItemAsync('donetoday_user', JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
  }

  async function signUp(name: string, email: string, password: string) {
    await api.post('/auth/register', { name, email, password })
  }

  async function signOut() {
    await SecureStore.deleteItemAsync('donetoday_token')
    await SecureStore.deleteItemAsync('donetoday_user')
    setToken(null)
    setUser(null)
  }

  async function forgotPassword(email: string) {
    await api.post('/auth/forgot-password', { email })
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, signIn, signUp, signOut, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)