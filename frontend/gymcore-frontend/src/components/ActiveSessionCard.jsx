function ActiveSessionCard({
  session,
  role,
  onViewTrainers,
  onViewRoutines,
  onViewClients,
  onViewTodayRoutine,
  onViewPreviousRoutines,
  onSignOut,
}) {
  return (
    <section className="card">
      <h2>Active session</h2>
      <p><strong>Name:</strong> {session?.fullName ?? '-'}</p>
      <p><strong>Email:</strong> {session?.email ?? '-'}</p>
      <p><strong>Role:</strong> {role || '-'}</p>

      <div className="actions">
        {role === 'Admin' || role === 'Staff' ? (
          <button type="button" onClick={onViewTrainers}>View trainers</button>
        ) : null}

        {role === 'Trainer' ? (
          <button type="button" onClick={onViewRoutines}>View routines</button>
        ) : null}

        {role === 'Trainer' ? (
          <button type="button" onClick={onViewClients}>View clients</button>
        ) : null}

        {role === 'Admin' || role === 'Staff' ? (
          <button type="button" onClick={onViewClients}>View clients</button>
        ) : null}

        {role === 'Client' ? (
          <button type="button" onClick={onViewTodayRoutine}>View today routine</button>
        ) : null}

        {role === 'Client' ? (
          <button type="button" onClick={onViewPreviousRoutines}>View previous routines</button>
        ) : null}

        <button type="button" onClick={onSignOut}>Sign out</button>
      </div>
    </section>
  )
}

export default ActiveSessionCard
