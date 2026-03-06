import { apiRequest } from '../lib/apiClient'

export function getUsers(token) {
  return apiRequest('/api/users', { token })
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

export function assignTrainer(token, payload) {
  return apiRequest('/api/users/assign-trainer', {
    method: 'PUT',
    token,
    body: payload,
  })
}
