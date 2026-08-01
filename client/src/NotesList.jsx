import { Link } from 'react-router-dom'

const NotesList = ({
  user,
  notes,
  notesLoading,
  notesError,
  creating,
  submitting,
  error,
  onCreate,
  onDelete,
  onLogout,
}) => {
  return (
    <div>
      <p>logged in as {user.email}</p>
      <button onClick={onLogout} disabled={submitting}>
        {submitting ? 'logging out...' : 'logout'}
      </button>
      {error && <p>{error}</p>}
      {notesLoading && <p>loading your notes...</p>}
      {notesError && (
        <p>your notes could not be loaded, please try refreshing the page</p>
      )}
      {!notesLoading &&
        !notesError &&
        (notes.length === 0 ? (
          <p>no notes yet</p>
        ) : (
          <ul>
            {notes.map((individualNote) => (
              <li key={individualNote.id}>
                <Link to={`/notes/${individualNote.id}`}>
                  {individualNote.title}
                </Link>
                <button onClick={() => onDelete(individualNote.id)}>
                  delete
                </button>
              </li>
            ))}
          </ul>
        ))}
      <button onClick={onCreate} disabled={creating}>
        {creating ? 'creating note...' : '+ create a new note'}
      </button>
    </div>
  )
}

export default NotesList
