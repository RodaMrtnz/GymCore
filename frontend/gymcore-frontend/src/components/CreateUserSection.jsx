function CreateUserSection({
  createRole,
  createFullName,
  createEmail,
  createUserName,
  createPassword,
  creatingUser,
  onRoleChange,
  onFullNameChange,
  onEmailChange,
  onUserNameChange,
  onPasswordChange,
  onSubmit,
}) {
  return (
    <section className="card">
      <h2>Create user</h2>
      <form className="create-user-form" onSubmit={onSubmit}>
        <select
          value={createRole}
          onChange={(event) => onRoleChange(event.target.value)}
        >
          <option value="Client">Client</option>
          <option value="Trainer">Trainer</option>
        </select>

        <input
          type="text"
          placeholder="Full name"
          value={createFullName}
          onChange={(event) => onFullNameChange(event.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={createEmail}
          onChange={(event) => onEmailChange(event.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Username"
          value={createUserName}
          onChange={(event) => onUserNameChange(event.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={createPassword}
          onChange={(event) => onPasswordChange(event.target.value)}
          required
        />

        <button type="submit" disabled={creatingUser}>
          {creatingUser ? 'Creating user...' : `Create ${createRole}`}
        </button>
      </form>
    </section>
  )
}

export default CreateUserSection
