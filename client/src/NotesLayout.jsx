import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import styles from './NotesLayout.module.css'

const NotesLayout = ({ user, notes, notesLoading, notesError, creating, submitting, error, onCreate, onDelete, onLogout, onRename, onToggleTheme, theme }) => {
  return (
    <div className={styles.shell}>
        <Sidebar
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
          onRename={onRename}
          onToggleTheme={onToggleTheme}
          theme={theme}
        />
      <main className={styles.editorPane}>
        <Outlet />
      </main>
    </div>
  )
}

export default NotesLayout
