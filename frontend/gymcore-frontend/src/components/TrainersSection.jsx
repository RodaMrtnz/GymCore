import TrainerCard from './TrainerCard'
import { getEntityId } from '../utils/appHelpers'

function TrainersSection({
  showTrainers,
  trainers,
  trainerRoutinesById,
  loadingTrainerRoutinesId,
  assigningTrainerByTrainerId,
  assignTrainerClientIdByTrainerId,
  onViewRoutines,
  onOpenRoutine,
  onAssignClientIdChange,
  onAssignTrainer,
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
              assignClientId={assignTrainerClientIdByTrainerId[trainerId]}
              onViewRoutines={onViewRoutines}
              onOpenRoutine={onOpenRoutine}
              onAssignClientIdChange={onAssignClientIdChange}
              onAssignTrainer={onAssignTrainer}
            />
          )
        })}
      </div>
    </section>
  )
}

export default TrainersSection
