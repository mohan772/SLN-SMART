import axios from 'axios'

const normalizeIds = (value) => {
  if (Array.isArray(value)) {
    return value.map(normalizeIds)
  }

  if (value && typeof value === 'object') {
    const normalized = {}
    for (const key of Object.keys(value)) {
      normalized[key] = normalizeIds(value[key])
    }
    if (value.id !== undefined && value._id === undefined) {
      normalized._id = value.id
    }
    return normalized
  }

  return value
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

const initToken = localStorage.getItem('token')
if (initToken) {
  api.defaults.headers.common.Authorization = `Bearer ${initToken}`
}

api.interceptors.response.use((response) => {
  response.data = normalizeIds(response.data)
  return response
})

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common.Authorization
  }
}

export default api
