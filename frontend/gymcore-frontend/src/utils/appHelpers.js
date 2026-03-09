export function toLabel(key) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function formatValue(value) {
  if (value === null || value === undefined || value === '') return '-'

  if (Array.isArray(value)) {
    if (value.length === 0) return '-'

    const parsed = value.map((item) => {
      if (item === null || item === undefined) return '-'
      if (typeof item === 'object') return JSON.stringify(item)
      return String(item)
    })

    return parsed.join(', ')
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return String(value)
}

export function getEntityId(value) {
  return String(value?.id ?? value?.Id ?? value?._id ?? value?.userId ?? value?.trainerId ?? '')
}

export function normalizeIdList(value) {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.$values)) return value.$values
  return []
}

export function normalizeRoutineList(payload, trainer) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.$values)) return payload.$values
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.Data)) return payload.Data
  if (Array.isArray(payload?.result)) return payload.result
  if (Array.isArray(payload?.Result)) return payload.Result
  if (Array.isArray(payload?.routines)) return payload.routines
  if (Array.isArray(payload?.Routines)) return payload.Routines
  if (Array.isArray(payload?.createdRoutines)) return payload.createdRoutines
  if (Array.isArray(payload?.CreatedRoutines)) return payload.CreatedRoutines
  if (Array.isArray(trainer?.createdRoutines)) return trainer.createdRoutines
  return []
}
