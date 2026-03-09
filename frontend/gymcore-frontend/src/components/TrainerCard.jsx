function toText(value) {
  if (value === null || value === undefined || value === '') return '-'
  return String(value)
}

function TrainerCard({
  trainer,
  routines,
  loadingRoutines,
  assigningTrainer,
  assignClientId,
  onViewRoutines,
  onOpenRoutine,
  onAssignClientIdChange,
  onAssignTrainer,
}) {
  const fullName = trainer?.fullName ?? trainer?.name
  const email = trainer?.email
  const trainerId = trainer?.id ?? trainer?.Id

  return (
    <article className="item-card trainer-card">
      <p>
        <strong>Full name:</strong> {toText(fullName)}
      </p>
      <p>
        <strong>Email:</strong> {toText(email)}
      </p>

      <button
        type="button"
        onClick={() => onViewRoutines(trainer)}
        disabled={loadingRoutines}
      >
        {loadingRoutines ? 'Loading routines...' : 'View trainer routines'}
      </button>

      <div className="assign-controls">
        <input
          type="text"
          placeholder="Client ID (GUID)"
          value={assignClientId ?? ''}
          onChange={(event) => onAssignClientIdChange(String(trainerId ?? ''), event.target.value)}
        />
        <button
          type="button"
          disabled={assigningTrainer}
          onClick={() => onAssignTrainer(trainer, assignClientId ?? '')}
        >
          {assigningTrainer ? 'Assigning trainer...' : 'Assign trainer'}
        </button>
      </div>

      {routines.length > 0 && (
        <section className="trainer-routines">
          {routines.map((routine, index) => (
            <article className="routine-item" key={routine?.id ?? routine?._id ?? index}>
              <p>
                <strong>Name:</strong> {toText(routine?.name)}
              </p>
              <button type="button" onClick={() => onOpenRoutine(routine, trainer)}>
                Open
              </button>
            </article>
          ))}
        </section>
      )}
    </article>
  )
}

export default TrainerCard
