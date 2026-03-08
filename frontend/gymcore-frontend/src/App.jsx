import { useMemo, useState } from 'react'
import { getCurrentSession, login, logout } from './services/authService'
import { getAllTrainers } from './services/usersService'
import { getMyRoutines, getTrainerRoutines } from './services/routinesService'
import TrainerCard from './components/TrainerCard'
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

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [session, setSession] = useState(() => getCurrentSession())
  const [loading, setLoading] = useState(false)
  const [loadingTrainerRoutinesId, setLoadingTrainerRoutinesId] = useState('')
  const [error, setError] = useState('')
  const [trainers, setTrainers] = useState([])
  const [routines, setRoutines] = useState([])
  const [trainerRoutinesById, setTrainerRoutinesById] = useState({})

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
      setTrainerRoutinesById({})
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setLoading(false)
    }
  }

  async function loadTrainers() {
    if (!session?.token) return
    setError('')
    try {
      const data = await getAllTrainers(session.token)
      setTrainers(data ?? [])
      setTrainerRoutinesById({})
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function loadRoutinesForTrainer(trainer) {
    if (!session?.token) return
    const trainerId = String(trainer?.id ?? trainer?._id ?? '')
    if (!trainerId) {
      setError('Could not identify the selected trainer')
      return
    }

    setError('')
    setLoadingTrainerRoutinesId(trainerId)
    try {
      const data = await getTrainerRoutines(session.token, trainerId)
      setTrainerRoutinesById((prev) => ({
        ...prev,
        [trainerId]: Array.isArray(data) ? data : [],
      }))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoadingTrainerRoutinesId('')
    }
  }

  async function loadRoutines() {
    if (!session?.token || !session?.userId) return
    setError('')
    try {
      if (role === 'Client') {
        const data = await getMyRoutines(session.token, session.userId)
        setRoutines(data ?? [])
      }
      if (role === 'Trainer') {
        const data = await getTrainerRoutines(session.token, session.userId)
        setRoutines(data ?? [])
      }
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  function handleLogout() {
    logout()
    setSession(null)
    setTrainers([])
    setRoutines([])
    setTrainerRoutinesById({})
    setEmail('')
    setPassword('')
    setError('')
  }

  return (
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
            <button type="button" onClick={loadTrainers}>View trainers</button>
            {(role === 'Client' || role === 'Trainer') && (
              <button type="button" onClick={loadRoutines}>View routines</button>
            )}
            <button type="button" onClick={handleLogout}>Sign out</button>
          </div>
        </section>
      )}

      {error && <p className="error">{error}</p>}

      {trainers.length > 0 && (
        <section className="card">
          <h2>Trainers</h2>
          <div className="list">
            {trainers.map((trainer, index) => {
              const trainerId = String(trainer?.id ?? trainer?._id ?? '')
              return (
              <TrainerCard
                key={trainerId || index}
                trainer={trainer}
                routines={trainerRoutinesById[trainerId] ?? []}
                loadingRoutines={loadingTrainerRoutinesId === trainerId}
                onViewRoutines={loadRoutinesForTrainer}
              />
              )
            })}
          </div>
        </section>
      )}

      {routines.length > 0 && (
        <section className="card">
          <h2>Routines</h2>
          <div className="list">
            {routines.map((routine, index) => (
              <article className="item-card" key={routine?.id ?? routine?._id ?? index}>
                {Object.entries(routine ?? {}).map(([key, value]) => (
                  <p key={key}>
                    <strong>{toLabel(key)}:</strong> {formatValue(value)}
                  </p>
                ))}
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

export default App
