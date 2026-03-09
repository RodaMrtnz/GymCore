import { useMemo, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { getCurrentSession, login, logout } from './services/authService'
import {
  createClientUser,
  createTrainerUser,
  assignTrainer,
  getAllClients,
  getAllTrainers,
  getClientById,
  getTrainerById,
  getTrainerClients,
} from './services/usersService'
import { assignRoutine, createRoutine, getMyRoutines, getRoutineById, getTrainerRoutines } from './services/routinesService'
import {formatValue,getEntityId,normalizeIdList,normalizeRoutineList,toLabel,} from './utils/appHelpers'
import { resetViewState } from './utils/appStateReset'
import ActiveSessionCard from './components/ActiveSessionCard'
import CreateRoutineSection from './components/CreateRoutineSection'
import CreateUserSection from './components/CreateUserSection'
import RoutinesSection from './components/RoutinesSection'
import StatusMessages from './components/StatusMessages'
import TodayRoutineSection from './components/TodayRoutineSection'
import TrainerClientsSection from './components/TrainerClientsSection'
import TrainersSection from './components/TrainersSection'
import RoutineDetailPage from './pages/RoutineDetailPage'
import gymCoreLogo from './assets/GymCoreLogo.png'
import './App.css'

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
  const [showTrainerClients, setShowTrainerClients] = useState(false)
  const [trainerClients, setTrainerClients] = useState([])
  const [loadingTrainerClients, setLoadingTrainerClients] = useState(false)
  const [todayRoutine, setTodayRoutine] = useState(null)
  const [todayRoutineTrainer, setTodayRoutineTrainer] = useState(null)
  const [todayRoutineError, setTodayRoutineError] = useState('')
  const [createRole, setCreateRole] = useState('Client')
  const [createFullName, setCreateFullName] = useState('')
  const [createEmail, setCreateEmail] = useState('')
  const [createUserName, setCreateUserName] = useState('')
  const [createPassword, setCreatePassword] = useState('')
  const [creatingUser, setCreatingUser] = useState(false)
  const [createUserMessage, setCreateUserMessage] = useState('')
  const [assignClientIdByRoutineId, setAssignClientIdByRoutineId] = useState({})
  const [assigningRoutineById, setAssigningRoutineById] = useState('')
  const [assigningRoutineToAllById, setAssigningRoutineToAllById] = useState('')
  const [assignRoutineMessage, setAssignRoutineMessage] = useState('')
  const [assignTrainerClientIdByTrainerId, setAssignTrainerClientIdByTrainerId] = useState({})
  const [assigningTrainerByTrainerId, setAssigningTrainerByTrainerId] = useState('')
  const [assignTrainerMessage, setAssignTrainerMessage] = useState('')
  const [routineName, setRoutineName] = useState('')
  const [routineDescription, setRoutineDescription] = useState('')
  const [routineTrainerId, setRoutineTrainerId] = useState('')
  const [creatingRoutine, setCreatingRoutine] = useState(false)
  const [createRoutineMessage, setCreateRoutineMessage] = useState('')

  const role = useMemo(() => session?.role ?? '', [session])

  const stateResetSetters = {
    setTrainers,
    setRoutines,
    setRoutinesTitle,
    setTrainerRoutinesById,
    setShowTrainers,
    setShowRoutines,
    setShowTodayRoutine,
    setShowTrainerClients,
    setTrainerClients,
    setTodayRoutine,
    setTodayRoutineTrainer,
    setTodayRoutineError,
    setCreateRole,
    setCreateFullName,
    setCreateEmail,
    setCreateUserName,
    setCreatePassword,
    setCreateUserMessage,
    setRoutineName,
    setRoutineDescription,
    setRoutineTrainerId,
    setCreateRoutineMessage,
    setAssignClientIdByRoutineId,
    setAssignRoutineMessage,
    setAssignTrainerClientIdByTrainerId,
    setAssigningTrainerByTrainerId,
    setAssignTrainerMessage,
  }

  async function handleLogin(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const nextSession = await login(email, password)
      setSession(nextSession)
      resetViewState(stateResetSetters)
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setLoading(false)
    }
  }

  async function loadTrainers() {
    if (!session?.token) return

    if (role !== 'Admin' && role !== 'Staff') {
      setError('Only Admin and Staff can view trainers')
      return
    }

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

  async function loadTrainerClients() {
    if (!session?.token || !session?.userId) return

    if (showTrainerClients) {
      setShowTrainerClients(false)
      setTrainerClients([])
      return
    }

    setError('')
    setLoadingTrainerClients(true)
    try {
      const data = role === 'Trainer'
        ? await getTrainerClients(session.token, session.userId)
        : role === 'Admin' || role === 'Staff'
          ? await getAllClients(session.token)
          : null

      if (!data) {
        setError('You do not have permission to view clients')
        return
      }

      const clients = Array.isArray(data)
        ? data
        : Array.isArray(data?.$values)
          ? data.$values
          : []

      setTrainerClients(clients)
      setShowTrainerClients(true)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoadingTrainerClients(false)
    }
  }

  async function handleAssignTrainerToClient(trainer, clientId) {
    if (!session?.token) return

    if (role !== 'Admin' && role !== 'Staff') {
      setError('Only Admin and Staff can assign trainer')
      return
    }

    const trainerId = getEntityId(trainer)
    const trimmedClientId = String(clientId ?? '').trim()

    if (!trainerId) {
      setError('Could not identify the selected trainer')
      return
    }

    if (!trimmedClientId) {
      setError('Client ID is required')
      return
    }

    setError('')
    setAssignTrainerMessage('')
    setAssigningTrainerByTrainerId(trainerId)

    try {
      await assignTrainer(session.token, {
        ClientId: trimmedClientId,
        TrainerId: trainerId,
      })

      setAssignTrainerMessage('Trainer assigned successfully')
      setAssignTrainerClientIdByTrainerId((prev) => ({
        ...prev,
        [trainerId]: '',
      }))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setAssigningTrainerByTrainerId('')
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

  async function handleCreateUser(event) {
    event.preventDefault()
    if (!session?.token) return

    setError('')
    setCreateUserMessage('')
    setCreatingUser(true)

    try {
      if (createRole === 'Trainer') {
        await createTrainerUser(session.token, {
          FullName: createFullName,
          Email: createEmail,
          UserName: createUserName,
          Password: createPassword,
        })
      } else {
        await createClientUser(session.token, {
          FullName: createFullName,
          Email: createEmail,
          UserName: createUserName,
          Password: createPassword,
          Role: 1,
        })
      }

      setCreateUserMessage(`${createRole} created successfully`)
      setCreateFullName('')
      setCreateEmail('')
      setCreateUserName('')
      setCreatePassword('')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setCreatingUser(false)
    }
  }

  async function handleCreateRoutine(event) {
    event.preventDefault()
    if (!session?.token) return

    if (role !== 'Admin' && role !== 'Trainer') {
      setError('Only Admin and Trainer can create routines')
      return
    }

    const targetTrainerId = role === 'Trainer'
      ? String(session.userId ?? '').trim()
      : String(routineTrainerId ?? '').trim()

    if (!targetTrainerId) {
      setError('Trainer ID is required')
      return
    }

    setError('')
    setCreateRoutineMessage('')
    setCreatingRoutine(true)

    try {
      await createRoutine(session.token, {
        Nombre: routineName,
        Descripcion: routineDescription,
        TrainerId: targetTrainerId,
      })

      setCreateRoutineMessage('Routine created successfully')
      setRoutineName('')
      setRoutineDescription('')
      if (role === 'Admin') {
        setRoutineTrainerId('')
      }
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setCreatingRoutine(false)
    }
  }

  async function assignRoutineToClientById(routine, clientId) {
    if (!session?.token) return

    const routineId = getEntityId(routine)
    const trimmedClientId = String(clientId ?? '').trim()

    if (!routineId) {
      setError('Could not identify the selected routine')
      return
    }

    if (!trimmedClientId) {
      setError('Client ID is required')
      return
    }

    setError('')
    setAssignRoutineMessage('')
    setAssigningRoutineById(routineId)

    try {
      await assignRoutine(session.token, {
        ClientId: trimmedClientId,
        RoutineId: routineId,
      })

      setAssignRoutineMessage('Routine assigned successfully')
      setAssignClientIdByRoutineId((prev) => ({
        ...prev,
        [routineId]: '',
      }))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setAssigningRoutineById('')
    }
  }

  async function assignRoutineToAllClients(routine) {
    if (!session?.token || !session?.userId) return

    const routineId = getEntityId(routine)
    if (!routineId) {
      setError('Could not identify the selected routine')
      return
    }

    setError('')
    setAssignRoutineMessage('')
    setAssigningRoutineToAllById(routineId)

    try {
      const trainerData = await getTrainerById(session.token, session.userId)
      const clientIds = normalizeIdList(trainerData?.clientIds ?? trainerData?.ClientIds)

      if (clientIds.length === 0) {
        setAssignRoutineMessage('This trainer has no clients assigned')
        return
      }

      const assignmentResults = await Promise.all(
        clientIds.map(async (clientId) => {
          try {
            await assignRoutine(session.token, {
              ClientId: clientId,
              RoutineId: routineId,
            })
            return { ok: true }
          } catch {
            return { ok: false }
          }
        }),
      )

      const successCount = assignmentResults.filter((result) => result.ok).length
      const failedCount = assignmentResults.length - successCount

      if (failedCount === 0) {
        setAssignRoutineMessage(`Routine assigned to ${successCount} clients`)
      } else {
        setAssignRoutineMessage(`Assigned to ${successCount} clients, failed for ${failedCount}`)
      }
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setAssigningRoutineToAllById('')
    }
  }

  function handleLogout() {
    logout()
    setSession(null)
    resetViewState(stateResetSetters)
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

  function handleAssignClientIdChange(routineId, value) {
    setAssignClientIdByRoutineId((prev) => ({
      ...prev,
      [routineId]: value,
    }))
  }

  function handleAssignTrainerClientIdChange(trainerId, value) {
    setAssignTrainerClientIdByTrainerId((prev) => ({
      ...prev,
      [trainerId]: value,
    }))
  }

  function handleDismissStatusMessage() {
    setError('')
    setCreateUserMessage('')
    setCreateRoutineMessage('')
    setAssignRoutineMessage('')
    setAssignTrainerMessage('')
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
              <ActiveSessionCard
                session={session}
                role={role}
                onViewTrainers={loadTrainers}
                onViewRoutines={loadRoutines}
                onViewClients={loadTrainerClients}
                onViewTodayRoutine={loadTodaysRoutineForClient}
                onViewPreviousRoutines={loadPreviousRoutinesForClient}
                onSignOut={handleLogout}
              />
            )}

            <StatusMessages
              error={error}
              createUserMessage={createUserMessage}
              createRoutineMessage={createRoutineMessage}
              assignRoutineMessage={assignRoutineMessage}
              assignTrainerMessage={assignTrainerMessage}
              onDismiss={handleDismissStatusMessage}
            />

            {(role === 'Admin' || role === 'Trainer') && session && (
              <CreateRoutineSection
                role={role}
                routineName={routineName}
                routineDescription={routineDescription}
                routineTrainerId={routineTrainerId}
                creatingRoutine={creatingRoutine}
                onRoutineNameChange={setRoutineName}
                onRoutineDescriptionChange={setRoutineDescription}
                onRoutineTrainerIdChange={setRoutineTrainerId}
                onSubmit={handleCreateRoutine}
              />
            )}

            {(role === 'Admin' || role === 'Staff') && session && (
              <CreateUserSection
                createRole={createRole}
                createFullName={createFullName}
                createEmail={createEmail}
                createUserName={createUserName}
                createPassword={createPassword}
                creatingUser={creatingUser}
                onRoleChange={setCreateRole}
                onFullNameChange={setCreateFullName}
                onEmailChange={setCreateEmail}
                onUserNameChange={setCreateUserName}
                onPasswordChange={setCreatePassword}
                onSubmit={handleCreateUser}
              />
            )}

            <TrainersSection
              showTrainers={showTrainers}
              trainers={trainers}
              trainerRoutinesById={trainerRoutinesById}
              loadingTrainerRoutinesId={loadingTrainerRoutinesId}
              assigningTrainerByTrainerId={assigningTrainerByTrainerId}
              assignTrainerClientIdByTrainerId={assignTrainerClientIdByTrainerId}
              onViewRoutines={loadRoutinesForTrainer}
              onOpenRoutine={openRoutineDetail}
              onAssignClientIdChange={handleAssignTrainerClientIdChange}
              onAssignTrainer={handleAssignTrainerToClient}
            />

            <TodayRoutineSection
              role={role}
              showTodayRoutine={showTodayRoutine}
              todayRoutine={todayRoutine}
              todayRoutineTrainer={todayRoutineTrainer}
              todayRoutineError={todayRoutineError}
              onOpenRoutine={openRoutineDetail}
            />

            <TrainerClientsSection
              role={role}
              showTrainerClients={showTrainerClients}
              loadingTrainerClients={loadingTrainerClients}
              trainerClients={trainerClients}
              onOpenRoutine={openRoutineDetail}
            />

            <RoutinesSection
              role={role}
              showRoutines={showRoutines}
              routines={routines}
              routinesTitle={routinesTitle}
              assignClientIdByRoutineId={assignClientIdByRoutineId}
              assigningRoutineById={assigningRoutineById}
              assigningRoutineToAllById={assigningRoutineToAllById}
              onOpenRoutine={openRoutineDetail}
              onAssignClientIdChange={handleAssignClientIdChange}
              onAssignByClientId={assignRoutineToClientById}
              onAssignToAll={assignRoutineToAllClients}
              toLabel={toLabel}
              formatValue={formatValue}
            />
          </main>
        }
      />

      <Route path="/routines/:routineId" element={<RoutineDetailPage session={session} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
