import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { getRoutineById } from '../services/routinesService'

function formatDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString('en-US')
}

function toText(value) {
  if (value === null || value === undefined || value === '') return '-'
  return String(value)
}

function RoutineDetailPage({ session }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { routineId } = useParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [routine, setRoutine] = useState(() => location.state?.routine ?? null)
  const trainer = location.state?.trainer ?? null

  useEffect(() => {
    if (routine || !routineId || !session?.token) return

    setLoading(true)
    setError('')

    getRoutineById(session.token, routineId)
      .then((data) => setRoutine(data ?? null))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [routine, routineId, session?.token])

  if (!session) {
    return <Navigate to="/" replace />
  }

  return (
    <main className="container">
      <section className="card routine-detail-card">
        <h2>Routine detail</h2>

        {loading && <p>Loading routine detail...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && routine && (
          <>
            {(trainer?.fullName || trainer?.name) && (
              <p>
                <strong>Trainer:</strong> {toText(trainer?.fullName ?? trainer?.name)}
              </p>
            )}
            <p>
              <strong>Name:</strong> {toText(routine?.name)}
            </p>
            <p>
              <strong>Description:</strong> {toText(routine?.description)}
            </p>
            <p>
              <strong>Date:</strong>{' '}
              {formatDate(routine?.date ?? routine?.routineDate ?? routine?.createdAt)}
            </p>
          </>
        )}

        {!loading && !error && !routine && (
          <p>Could not load routine detail.</p>
        )}

        <button type="button" onClick={() => navigate(-1)}>
          Back
        </button>
      </section>
    </main>
  )
}

export default RoutineDetailPage
