import { useMemo, useState } from 'react'
import { getCurrentSession, login, logout } from './services/authService'
import { getAllTrainers } from './services/usersService'
import { getMyRoutines, getTrainerRoutines } from './services/routinesService'
import './App.css'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [session, setSession] = useState(() => getCurrentSession())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [trainers, setTrainers] = useState([])
  const [routines, setRoutines] = useState([])

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
    } catch (requestError) {
      setError(requestError.message)
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
    setEmail('')
    setPassword('')
    setError('')
  }

  return (
    <main className="container">
      <h1>GymCore Frontend</h1>

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
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      ) : (
        <section className="card">
          <h2>Sesión activa</h2>
          <p><strong>Nombre:</strong> {session.fullName ?? '-'}</p>
          <p><strong>Email:</strong> {session.email ?? '-'}</p>
          <p><strong>Rol:</strong> {role || '-'}</p>
          <p><strong>UserId:</strong> {session.userId ?? '-'}</p>

          <div className="actions">
            <button type="button" onClick={loadTrainers}>Ver trainers</button>
            {(role === 'Client' || role === 'Trainer') && (
              <button type="button" onClick={loadRoutines}>Ver rutinas</button>
            )}
            <button type="button" onClick={handleLogout}>Cerrar sesión</button>
          </div>
        </section>
      )}

      {error && <p className="error">{error}</p>}

      {trainers.length > 0 && (
        <section className="card">
          <h2>Trainers</h2>
          <pre>{JSON.stringify(trainers, null, 2)}</pre>
        </section>
      )}

      {routines.length > 0 && (
        <section className="card">
          <h2>Rutinas</h2>
          <pre>{JSON.stringify(routines, null, 2)}</pre>
        </section>
      )}
    </main>
  )
}

export default App
