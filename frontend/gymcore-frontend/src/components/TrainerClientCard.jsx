import { formatValue } from '../utils/appHelpers'

function TrainerClientCard({ client, onOpenTodayRoutine }) {
  const todaysRoutine = client?.todaysRoutine ?? client?.TodaysRoutine ?? null

  return (
    <article className="item-card">
      <p>
        <strong>Full name:</strong> {formatValue(client?.fullName ?? client?.FullName)}
      </p>
      <p>
        <strong>Email:</strong> {formatValue(client?.email ?? client?.Email)}
      </p>
      <p>
        <strong>Client ID:</strong> {formatValue(client?.id ?? client?.Id)}
      </p>
      <p>
        <strong>Today routine:</strong> {formatValue(todaysRoutine?.name ?? todaysRoutine?.Name ?? 'Not assigned')}
      </p>

      {todaysRoutine ? (
        <button type="button" onClick={() => onOpenTodayRoutine(todaysRoutine)}>
          Open today routine
        </button>
      ) : null}
    </article>
  )
}

export default TrainerClientCard
