import { apiRequest } from '../lib/apiClient'
import { getSessionFromToken } from '../lib/jwt'

const TOKEN_KEY = 'gymcore_token'

export async function login(email, password) {
  const data = await apiRequest('/api/users/login', {
    method: 'POST',
    body: { email, password },
  })

  if (!data?.token) {
    throw new Error('The backend did not return a token.')
  }

  localStorage.setItem(TOKEN_KEY, data.token)
  return getSessionFromToken(data.token)
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
}

export function getCurrentSession() {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) return null
  return getSessionFromToken(token)
}
