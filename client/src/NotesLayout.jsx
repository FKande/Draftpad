import { Outlet } from 'react-router-dom'
import NotesList from './NotesList'

const NotesLayout = ({ user, notes, notesLoading, notesError, creating, submitting, error, onCreate, onDelete, onLogout }) => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <aside style={{ width: '250px', borderRight: '1px solid #ccc' }}>
        <NotesList
          user={user}
          notes={notes}
          notesLoading={notesLoading}
          notesError={notesError}
          creating={creating}
          submitting={submitting}
          error={error}
          onCreate={onCreate}
          onDelete={onDelete}
          onLogout={onLogout}
        />
      </aside>
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  )
}

export default NotesLayout
