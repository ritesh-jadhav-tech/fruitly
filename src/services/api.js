import axios from 'axios'
import toast from 'react-hot-toast'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Request interceptor: attach JWT ──────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fruitmart_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor: global error handling ───────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status  = error.response?.status
    const message = error.response?.data?.message || 'Something went wrong'

    if (status === 401) {
      localStorage.removeItem('fruitmart_token')
      localStorage.removeItem('fruitmart_user')
      // Redirect to login only if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    } else if (status === 403) {
      toast.error('You do not have permission to do that.')
    } else if (status >= 500) {
      toast.error('Server error — please try again later.')
    }

    return Promise.reject({ ...error, message })
  }
)

export default api
