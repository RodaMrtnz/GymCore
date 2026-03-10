import TrainerCard from './TrainerCard'
import { getEntityId } from '../utils/appHelpers'

function TrainersSection({
  role,
  showTrainers,
  trainers,
  trainerRoutinesById,
  loadingTrainerRoutinesId,
  assigningTrainerByTrainerId,
  deletingRoutineId,
  assignTrainerClientIdByTrainerId,
  onViewRoutines,
  onOpenRoutine,
  onAssignClientIdChange,
  onAssignTrainer,
  onDeleteRoutine,
}) {
  if (!showTrainers || trainers.length === 0) {
    return null
  }

  return (
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
              assigningTrainer={assigningTrainerByTrainerId === trainerId}
              canDeleteRoutines={role === 'Admin' || role === 'Trainer'}
              deletingRoutineId={deletingRoutineId}
              assignClientId={assignTrainerClientIdByTrainerId[trainerId]}
              onViewRoutines={onViewRoutines}
              onOpenRoutine={onOpenRoutine}
              onAssignClientIdChange={onAssignClientIdChange}
              onAssignTrainer={onAssignTrainer}
              onDeleteRoutine={onDeleteRoutine}
            />
          )
        })}
      </div>
    </section>
  )
}

export default TrainersSection
