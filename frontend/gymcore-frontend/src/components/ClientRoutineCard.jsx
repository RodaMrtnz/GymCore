function ClientRoutineCard({ routine, onOpen }) {
  return (
    <article className="item-card">
      <p>
        <strong>Name:</strong> {routine?.name ?? '-'}
      </p>
      <button type="button" onClick={() => onOpen(routine)}>
        Open
      </button>
    </article>
  )
}

export default ClientRoutineCard
