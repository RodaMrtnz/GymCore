import ClientRoutineCard from './ClientRoutineCard'
import TrainerOwnRoutineCard from './TrainerOwnRoutineCard'
import { getEntityId } from '../utils/appHelpers'

function RoutinesSection({
  role,
  showRoutines,
  routines,
  routinesTitle,
  assignClientIdByRoutineId,
  assigningRoutineById,
  assigningRoutineToAllById,
  onOpenRoutine,
  onAssignClientIdChange,
  onAssignByClientId,
  onAssignToAll,
  toLabel,
  formatValue,
}) {
  if (!showRoutines) {
    return null
  }

  if (routines.length === 0) {
    if (role === 'Trainer') {
      return (
        <section className="card">
          <h2>Routines</h2>
          <p>No routines found for this trainer.</p>
        </section>
      )
    }

    if (role === 'Client' && routinesTitle === 'Previous routines') {
      return (
        <section className="card">
          <h2>Previous routines</h2>
          <p>No previous routines found.</p>
        </section>
      )
    }

    return null
  }

  return (
    <section className="card">
      <h2>{routinesTitle}</h2>
      <div className="list">
        {routines.map((routine, index) => (
          role === 'Client' ? (
            <ClientRoutineCard
              key={routine?.id ?? routine?._id ?? index}
              routine={routine}
              onOpen={(nextRoutine) => onOpenRoutine(nextRoutine, null)}
            />
          ) : role === 'Trainer' ? (
            <TrainerOwnRoutineCard
              key={routine?.id ?? routine?._id ?? index}
              routine={routine}
              assignClientId={assignClientIdByRoutineId[getEntityId(routine)]}
              assigningRoutineById={assigningRoutineById}
              assigningRoutineToAllById={assigningRoutineToAllById}
              onAssignClientIdChange={onAssignClientIdChange}
              onOpen={onOpenRoutine}
              onAssignByClientId={onAssignByClientId}
              onAssignToAll={onAssignToAll}
              formatValue={formatValue}
            />
          ) : (
            <article className="item-card" key={routine?.id ?? routine?._id ?? index}>
              {Object.entries(routine ?? {}).map(([key, value]) => (
                <p key={key}>
                  <strong>{toLabel(key)}:</strong> {formatValue(value)}
                </p>
              ))}
            </article>
          )
        ))}
      </div>
    </section>
  )
}

export default RoutinesSection
