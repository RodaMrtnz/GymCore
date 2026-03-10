function EditUserSection({
  role,
  editTargetUserId,
  editFullName,
  editEmail,
  editUserName,
  updatingUser,
  onTargetUserIdChange,
  onFullNameChange,
  onEmailChange,
  onUserNameChange,
  onSubmit,
}) {
  const isClient = role === 'Client'

  return (
    <section className="card">
      <h2>{isClient ? 'Edit my profile' : 'Edit user'}</h2>
      <form className="create-user-form" onSubmit={onSubmit}>
        {!isClient && (
          <input
            type="text"
            placeholder="User ID (GUID, optional)"
            value={editTargetUserId}
            onChange={(event) => onTargetUserIdChange(event.target.value)}
          />
        )}

        <input
          type="text"
          placeholder="Full name (optional)"
          value={editFullName}
          onChange={(event) => onFullNameChange(event.target.value)}
        />

        <input
          type="email"
          placeholder="Email (optional)"
          value={editEmail}
          onChange={(event) => onEmailChange(event.target.value)}
        />

        <input
          type="text"
          placeholder="Username (optional)"
          value={editUserName}
          onChange={(event) => onUserNameChange(event.target.value)}
        />

        <button type="submit" disabled={updatingUser}>
          {updatingUser ? 'Updating user...' : 'Update user'}
        </button>
      </form>
    </section>
  )
}

export default EditUserSection