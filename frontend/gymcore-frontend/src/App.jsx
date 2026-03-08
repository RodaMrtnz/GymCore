import { useMemo, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { getCurrentSession, login, logout } from './services/authService'
import { getAllTrainers, getClientById, getTrainerById } from './services/usersService'
import { getMyRoutines, getRoutineById, getTrainerRoutines } from './services/routinesService'
import TrainerCard from './components/TrainerCard'
import ClientRoutineCard from './components/ClientRoutineCard'
import RoutineDetailPage from './pages/RoutineDetailPage'
import gymCoreLogo from './assets/GymCoreLogo.png'
import './App.css'

function toLabel(key) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function formatValue(value) {
  if (value === null || value === undefined || value === '') return '-'
  if (Array.isArray(value)) {
    if (value.length === 0) return '-'
    const parsed = value.map((item) => {
      if (item === null || item === undefined) return '-'
      if (typeof item === 'object') return JSON.stringify(item)
      return String(item)
    })
    return parsed.join(', ')
  }
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return String(value)
}

function getEntityId(value) {
  return String(value?.id ?? value?.Id ?? value?._id ?? value?.userId ?? value?.trainerId ?? '')
}

function normalizeRoutineList(payload, trainer) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.$values)) return payload.$values
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.Data)) return payload.Data
  if (Array.isArray(payload?.result)) return payload.result
  if (Array.isArray(payload?.Result)) return payload.Result
  if (Array.isArray(payload?.routines)) return payload.routines
  if (Array.isArray(payload?.Routines)) return payload.Routines
  if (Array.isArray(payload?.createdRoutines)) return payload.createdRoutines
  if (Array.isArray(payload?.CreatedRoutines)) return payload.CreatedRoutines
  if (Array.isArray(trainer?.createdRoutines)) return trainer.createdRoutines
  return []
}

function App() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [session, setSession] = useState(() => getCurrentSession())
  const [loading, setLoading] = useState(false)
  const [loadingTrainerRoutinesId, setLoadingTrainerRoutinesId] = useState('')
  const [error, setError] = useState('')
  const [trainers, setTrainers] = useState([])
  const [routines, setRoutines] = useState([])
  const [trainerRoutinesById, setTrainerRoutinesById] = useState({})
  const [routinesTitle, setRoutinesTitle] = useState('Routines')
  const [showTrainers, setShowTrainers] = useState(false)
  const [showRoutines, setShowRoutines] = useState(false)
  const [showTodayRoutine, setShowTodayRoutine] = useState(false)
  const [todayRoutine, setTodayRoutine] = useState(null)
  const [todayRoutineTrainer, setTodayRoutineTrainer] = useState(null)
  const [todayRoutineError, setTodayRoutineError] = useState('')

  const role = useMemo(() => session?.role ?? '', [session])

  async function handleLogin(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const nextSession = await login(email, password)
      setSession(nextSession)
      setTrainers([])
      setRoutines([])
      setRoutinesTitle('Routines')
      setTrainerRoutinesById({})
      setShowTrainers(false)
      setShowRoutines(false)
      setShowTodayRoutine(false)
      setTodayRoutine(null)
      setTodayRoutineTrainer(null)
      setTodayRoutineError('')
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setLoading(false)
    }
  }

  async function loadTrainers() {
    if (!session?.token) return

    if (showTrainers) {
      setShowTrainers(false)
      setTrainers([])
      setTrainerRoutinesById({})
      return
    }

    setError('')
    try {
      const data = await getAllTrainers(session.token)
      const trainerList = Array.isArray(data) ? data : []
      setTrainers(trainerList)
      setShowTrainers(true)

      const preloaded = {}
      trainerList.forEach((trainer) => {
        const trainerId = getEntityId(trainer)
        if (!trainerId) return
        const routinesForTrainer = normalizeRoutineList(null, trainer)
        if (routinesForTrainer.length > 0) {
          preloaded[trainerId] = routinesForTrainer
        }
      })

      setTrainerRoutinesById(preloaded)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function loadRoutinesForTrainer(trainer) {
    if (!session?.token) return
    const trainerId = getEntityId(trainer)
    if (!trainerId) {
      setError('Could not identify the selected trainer')
      return
    }

    setError('')
    setLoadingTrainerRoutinesId(trainerId)
    try {
      const data = await getTrainerRoutines(session.token, trainerId)
      const normalized = normalizeRoutineList(data, trainer)
      setTrainerRoutinesById((prev) => ({
        ...prev,
        [trainerId]: normalized,
      }))
    } catch (requestError) {
      if (requestError?.status === 403) {
        setError('You do not have permission to view this')
      } else {
        setError(requestError.message)
      }
    } finally {
      setLoadingTrainerRoutinesId('')
    }
  }

  async function loadRoutines() {
    if (!session?.token || !session?.userId) return

    if (showRoutines) {
      setShowRoutines(false)
      setRoutines([])
      return
    }

    setError('')
    try {
      if (role === 'Trainer') {
        const data = await getTrainerRoutines(session.token, session.userId)
        let routineList = normalizeRoutineList(data, null)

        // Fallback for scenarios where routine endpoint returns empty but trainer has routine IDs.
        if (routineList.length === 0) {
          const trainerData = await getTrainerById(session.token, session.userId)
          const routineIds = trainerData?.createdRoutineIds ?? trainerData?.CreatedRoutineIds ?? []

          if (Array.isArray(routineIds) && routineIds.length > 0) {
            const routinesById = await Promise.all(
              routineIds.map(async (id) => {
                if (!id) return null
                try {
                  return await getRoutineById(session.token, id)
                } catch {
                  return null
                }
              }),
            )

            routineList = routinesById.filter(Boolean)
          }
        }

        setRoutinesTitle('Routines')
        setRoutines(routineList)
        setShowRoutines(true)
      }
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function loadTodaysRoutineForClient() {
    if (!session?.token || !session?.userId) return

    if (showTodayRoutine) {
      setShowTodayRoutine(false)
      setTodayRoutine(null)
      setTodayRoutineTrainer(null)
      setTodayRoutineError('')
      return
    }

    setError('')
    setTodayRoutineError('')

    try {
      const client = await getClientById(session.token, session.userId)
      const todaysRoutine = client?.todaysRoutine ?? client?.TodaysRoutine
      const trainer = client?.trainer ?? client?.Trainer ?? null

      setTodayRoutine(todaysRoutine ?? null)
      setTodayRoutineTrainer(trainer)
      setShowTodayRoutine(true)

      if (!todaysRoutine) {
        setTodayRoutineError('No routine assigned for today')
        return
      }
    } catch (requestError) {
      setTodayRoutine(null)
      setTodayRoutineTrainer(null)
      setShowTodayRoutine(true)
      setTodayRoutineError(requestError.message)
    }
  }

  async function loadPreviousRoutinesForClient() {
    if (!session?.token || !session?.userId) return

    if (showRoutines && routinesTitle === 'Previous routines') {
      setShowRoutines(false)
      setRoutines([])
      return
    }

    setError('')

    try {
      const data = await getMyRoutines(session.token, session.userId)
      setRoutinesTitle('Previous routines')
      setRoutines(Array.isArray(data) ? data : [])
      setShowRoutines(true)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  function handleLogout() {
    logout()
    setSession(null)
    setTrainers([])
    setRoutines([])
    setRoutinesTitle('Routines')
    setTrainerRoutinesById({})
    setShowTrainers(false)
    setShowRoutines(false)
    setShowTodayRoutine(false)
    setTodayRoutine(null)
    setTodayRoutineTrainer(null)
    setTodayRoutineError('')
    setEmail('')
    setPassword('')
    setError('')
    navigate('/')
  }

  function openRoutineDetail(routine, trainer) {
    const routineId = getEntityId(routine)
    if (!routineId) {
      setError('Could not identify the selected routine')
      return
    }

    navigate(`/routines/${routineId}`, {
      state: {
        routine,
        trainer,
      },
    })
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <main className="container">
            <h1 className="title-row">
              <img className="title-logo" src={gymCoreLogo} alt="GymCore logo" />
              GymCore
            </h1>

            {!session ? (
              <form className="card" onSubmit={handleLogin}>
                <h2>Login</h2>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button type="submit" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>
            ) : (
              <section className="card">
                <h2>Active session</h2>
                <p><strong>Name:</strong> {session.fullName ?? '-'}</p>
                <p><strong>Email:</strong> {session.email ?? '-'}</p>
                <p><strong>Role:</strong> {role || '-'}</p>

                <div className="actions">
                  {role !== 'Client' || role === 'Trainer' && (
                    <button type="button" onClick={loadTrainers}>View trainers</button>
                  )}

                  {role === 'Trainer' && (
                    <button type="button" onClick={loadRoutines}>View routines</button>
                  )}

                  {role === 'Client' && (
                    <button type="button" onClick={loadTodaysRoutineForClient}>View today routine</button>
                  )}

                  {role === 'Client' && (
                    <button type="button" onClick={loadPreviousRoutinesForClient}>View previous routines</button>
                  )}

                  <button type="button" onClick={handleLogout}>Sign out</button>
                </div>
              </section>
            )}

            {error && <p className="error">{error}</p>}

            {showTrainers && trainers.length > 0 && (
              <section className="card">
                <h2>Trainers</h2>
                <div className="list">
                  {trainers.map((trainer, index) => {
                    const trainerId = getEntityId(trainer)
                    return (
                      <TrainerCard
                        key={trainerId || index}
                        trainer={trainer}
                        routines={trainerRoutinesById[trainerId] ?? []}
                        loadingRoutines={loadingTrainerRoutinesId === trainerId}
                        onViewRoutines={loadRoutinesForTrainer}
                        onOpenRoutine={openRoutineDetail}
                      />
                    )
                  })}
                </div>
              </section>
            )}

            {role === 'Client' && showTodayRoutine && (
              <section className="card">
                <h2>Today routine</h2>

                {todayRoutine ? (
                  <div className="list">
                    <ClientRoutineCard
                      routine={todayRoutine}
                      onOpen={(nextRoutine) => openRoutineDetail(nextRoutine, todayRoutineTrainer)}
                    />
                  </div>
                ) : (
                  <p>{todayRoutineError || 'No routine assigned for today'}</p>
                )}
              </section>
            )}

            {showRoutines && routines.length > 0 && (
              <section className="card">
                <h2>{routinesTitle}</h2>
                <div className="list">
                  {routines.map((routine, index) => (
                    role === 'Client' ? (
                      <ClientRoutineCard
                        key={routine?.id ?? routine?._id ?? index}
                        routine={routine}
                        onOpen={(nextRoutine) => openRoutineDetail(nextRoutine, null)}
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
            )}

            {role === 'Trainer' && showRoutines && routines.length === 0 && (
              <section className="card">
                <h2>Routines</h2>
                <p>No routines found for this trainer.</p>
              </section>
            )}
            
            {role === 'Client' && showRoutines && routinesTitle === 'Previous routines' && routines.length === 0 && (
              <section className="card">
                <h2>Previous routines</h2>
                <p>No previous routines found.</p>
              </section>
            )}
          </main>
        }
      />

      <Route path="/routines/:routineId" element={<RoutineDetailPage session={session} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
