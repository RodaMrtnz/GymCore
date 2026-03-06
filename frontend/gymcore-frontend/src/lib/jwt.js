function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padding = '='.repeat((4 - (normalized.length % 4)) % 4)
  return atob(normalized + padding)
}

export function parseJwt(token) {
  if (!token) return null

  try {
    const [, payload] = token.split('.')
    if (!payload) return null
    return JSON.parse(decodeBase64Url(payload))
  } catch {
    return null
  }
}

export function getSessionFromToken(token) {
  const payload = parseJwt(token)
  if (!payload) return null

  const role = payload.role ?? payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
  const fullName = payload.unique_name ?? payload.name ?? payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
  const email = payload.email ?? payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']
  const userId = payload.sub ?? payload.nameid ?? payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']

  return {
    token,
    role,
    fullName,
    email,
    userId,
  }
}
