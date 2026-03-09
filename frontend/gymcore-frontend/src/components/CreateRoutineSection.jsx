function CreateRoutineSection({
  role,
  routineName,
  routineDescription,
  routineTrainerId,
  creatingRoutine,
  onRoutineNameChange,
  onRoutineDescriptionChange,
  onRoutineTrainerIdChange,
  onSubmit,
}) {
  return (
    <section className="card">
      <h2>Create routine</h2>
      <form className="create-routine-form" onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Routine name"
          value={routineName}
          onChange={(event) => onRoutineNameChange(event.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Routine description"
          value={routineDescription}
          onChange={(event) => onRoutineDescriptionChange(event.target.value)}
          required
        />

        {role === 'Admin' ? (
          <input
            type="text"
            placeholder="Trainer ID (GUID)"
            value={routineTrainerId}
            onChange={(event) => onRoutineTrainerIdChange(event.target.value)}
            required
          />
        ) : null}

        <button type="submit" disabled={creatingRoutine}>
          {creatingRoutine ? 'Creating routine...' : 'Create routine'}
        </button>
      </form>
    </section>
  )
}

export default CreateRoutineSection
