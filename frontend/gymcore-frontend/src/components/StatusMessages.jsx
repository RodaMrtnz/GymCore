import { useMemo } from 'react'

function StatusMessages({
  error,
  createUserMessage,
  createRoutineMessage,
  assignRoutineMessage,
  assignTrainerMessage,
  onDismiss,
}) {
  const message = useMemo(() => (
    error
    || assignTrainerMessage
    || assignRoutineMessage
    || createRoutineMessage
    || createUserMessage
    || ''
  ), [error, assignTrainerMessage, assignRoutineMessage, createRoutineMessage, createUserMessage])

  if (!message) {
    return null
  }

  return (
    <div className="status-modal-backdrop" role="presentation">
      <div className="status-modal" role="alertdialog" aria-live="assertive" aria-modal="true">
        <p className={error ? 'status-modal-text status-modal-text-error' : 'status-modal-text'}>{message}</p>
        <button type="button" onClick={onDismiss}>OK</button>
      </div>
    </div>
  )
}

export default StatusMessages
