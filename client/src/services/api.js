import axios from 'axios'
import { getAccessToken, setAccessToken, clearAccessToken } from './tokenStore'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// --- refresh queue ---
// Prevents multiple simultaneous 401s from each triggering their own refresh call.
let isRefreshing = false
let waitQueue = []

const resolveQueue = (token) => {
  waitQueue.forEach(({ resolve }) => resolve(token))
  waitQueue = []
}

const rejectQueue = (err) => {
  waitQueue.forEach(({ reject }) => reject(err))
  waitQueue = []
}

// --- request interceptor ---
api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// --- response interceptor ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    // Only attempt refresh on 401, and not for the refresh endpoint itself
    if (
      error.response?.status !== 401 ||
      original._retry ||
      original.url === '/auth/refresh'
    ) {
      return Promise.reject(error)
    }

    // Queue additional requests while a refresh is in flight
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        waitQueue.push({ resolve, reject })
      }).then((newToken) => {
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      })
    }

    original._retry = true
    isRefreshing = true

    try {
      const storedRefresh = localStorage.getItem('refreshToken')
      if (!storedRefresh) throw new Error('no_refresh_token')

      const { data } = await axios.post('/api/auth/refresh', {
        refreshToken: storedRefresh,
      })

      setAccessToken(data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)

      resolveQueue(data.accessToken)
      original.headers.Authorization = `Bearer ${data.accessToken}`
      return api(original)
    } catch (err) {
      rejectQueue(err)
      clearAccessToken()
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      window.location.href = '/login'
      return Promise.reject(err)
    } finally {
      isRefreshing = false
    }
  }
)

export default api
