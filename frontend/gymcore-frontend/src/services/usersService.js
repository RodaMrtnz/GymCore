import { apiRequest } from '../lib/apiClient'

export function getUsers(token) {
  return apiRequest('/api/users', { token })
}

export async function getAllClients(token) {
  const data = await getUsers(token)
  const users = Array.isArray(data) ? data : Array.isArray(data?.$values) ? data.$values : []

  // Some backend responses can label non-client users as client in generic user DTOs.
  // Validate each id against the dedicated client endpoint and keep only real clients.
  const resolvedClients = await Promise.all(
    users.map(async (user) => {
      const userId = user?.id ?? user?.Id
      if (!userId) return null

      try {
        return await getClientById(token, userId)
      } catch {
        return null
      }
    }),
  )

  return resolvedClients.filter(Boolean)
}

export function createClientUser(token, payload) {
  return apiRequest('/api/users', {
    method: 'POST',
    token,
    body: payload,
  })
}

export function createTrainerUser(token, payload) {
  return apiRequest('/api/users/trainer', {
    method: 'POST',
    token,
    body: payload,
  })
}

export function getAllTrainers(token) {
  return apiRequest('/api/users/trainers', { token })
}

export function getClientById(token, id) {
  return apiRequest(`/api/users/client/${id}`, { token })
}

export function getTrainerById(token, id) {
  return apiRequest(`/api/users/trainer/${id}`, { token })
}

export function getTrainerClients(token, trainerId) {
  return apiRequest(`/api/users/trainer/${trainerId}/clients`, { token })
}

export function assignTrainer(token, payload) {
  return apiRequest('/api/users/assign-trainer', {
    method: 'PUT',
    token,
    body: payload,
  })
}
