import { apiRequest } from '../lib/apiClient'

export function getRoutineById(token, id) {
  return apiRequest(`/api/routines/${id}`, { token })
}

export function getMyRoutines(token, clientId) {
  return apiRequest(`/api/routines/my-routines/${clientId}`, { token })
}

export function getTrainerRoutines(token, trainerId) {
  return apiRequest(`/api/routines/trainer-routines/${trainerId}`, { token })
}

export function createRoutine(token, payload) {
  return apiRequest('/api/routines', {
    method: 'POST',
    token,
    body: payload,
  })
}

export function assignRoutine(token, payload) {
  return apiRequest('/api/routines/assign-routine', {
    method: 'PUT',
    token,
    body: payload,
  })
}

export function deleteRoutine(token, id) {
  return apiRequest(`/api/routines/${id}`, {
    method: 'DELETE',
    token,
  })
}
