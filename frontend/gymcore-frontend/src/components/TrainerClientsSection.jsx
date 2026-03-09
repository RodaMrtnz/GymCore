import TrainerClientCard from './TrainerClientCard'

function TrainerClientsSection({ role, showTrainerClients, loadingTrainerClients, trainerClients, onOpenRoutine }) {
  if (!showTrainerClients || (role !== 'Trainer' && role !== 'Admin' && role !== 'Staff')) {
    return null
  }

  const sectionTitle = role === 'Trainer' ? 'My clients' : 'Clients'

  return (
    <section className="card">
      <h2>{sectionTitle}</h2>

      {loadingTrainerClients ? <p>Loading clients...</p> : null}

      {!loadingTrainerClients && trainerClients.length === 0 ? (
        <p>No clients assigned to this trainer.</p>
      ) : null}

      {!loadingTrainerClients && trainerClients.length > 0 ? (
        <div className="list">
          {trainerClients.map((client, index) => (
            <TrainerClientCard
              key={client?.id ?? client?.Id ?? index}
              client={client}
              onOpenTodayRoutine={(routine) => onOpenRoutine(routine, null)}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}

export default TrainerClientsSection
