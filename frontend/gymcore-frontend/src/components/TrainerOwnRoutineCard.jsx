import { getEntityId } from '../utils/appHelpers'

function TrainerOwnRoutineCard({
  routine,
  assigningRoutineById,
  assigningRoutineToAllById,
  assignClientId,
  onAssignClientIdChange,
  onOpen,
  onAssignByClientId,
  onAssignToAll,
  formatValue,
}) {
  const routineId = getEntityId(routine)

  return (
    <article className="item-card">
      <p>
        <strong>Name:</strong> {formatValue(routine?.name)}
      </p>
      <p>
        <strong>Description:</strong> {formatValue(routine?.description)}
      </p>

      <div className="actions">
        <button type="button" onClick={() => onOpen(routine, null)}>
          Open
        </button>
      </div>

      <div className="assign-controls">
        <input
          type="text"
          placeholder="Client ID (GUID)"
          value={assignClientId ?? ''}
          onChange={(event) => onAssignClientIdChange(routineId, event.target.value)}
        />

        <div className="actions">
          <button
            type="button"
            disabled={assigningRoutineById === routineId}
            onClick={() => onAssignByClientId(routine, assignClientId ?? '')}
          >
            {assigningRoutineById === routineId ? 'Assigning...' : 'Assign by client ID'}
          </button>

          <button
            type="button"
            disabled={assigningRoutineToAllById === routineId}
            onClick={() => onAssignToAll(routine)}
          >
            {assigningRoutineToAllById === routineId ? 'Assigning to all...' : 'Assign to all my clients'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default TrainerOwnRoutineCard
