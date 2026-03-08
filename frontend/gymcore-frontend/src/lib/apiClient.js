const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5156'

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  return text || null
}

export async function apiRequest(path, { method = 'GET', body, token, headers } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const errorBody = await parseResponse(response)
    const message = typeof errorBody === 'string' && errorBody
      ? errorBody
      : errorBody?.message ?? `HTTP ${response.status}`
    const error = new Error(message)
    error.status = response.status
    throw error
  }

  if (response.status === 204) {
    return null
  }

  return parseResponse(response)
}
