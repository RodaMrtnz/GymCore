import ClientRoutineCard from './ClientRoutineCard'

function TodayRoutineSection({ role, showTodayRoutine, todayRoutine, todayRoutineTrainer, todayRoutineError, onOpenRoutine }) {
  if (role !== 'Client' || !showTodayRoutine) {
    return null
  }

  return (
    <section className="card">
      <h2>Today routine</h2>

      {todayRoutine ? (
        <div className="list">
          <ClientRoutineCard
            routine={todayRoutine}
            onOpen={(nextRoutine) => onOpenRoutine(nextRoutine, todayRoutineTrainer)}
          />
        </div>
      ) : (
        <p>{todayRoutineError || 'No routine assigned for today'}</p>
      )}
    </section>
  )
}

export default TodayRoutineSection
