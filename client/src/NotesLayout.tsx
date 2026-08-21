import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import styles from './NotesLayout.module.css'
import type { Note, User } from './api'
import type { Theme } from './App'

type NotesLayoutProps = {
  user: User | null
  notes: Note[]
  notesLoading: boolean
  notesError: boolean
  creating: boolean
  submitting: boolean
  onCreate: () => void
  onDelete: (id: string) => Promise<void>
  onLogout: () => void
  onRename: (id: string, newTitle: string) => Promise<void>
  onToggleTheme: () => void
  theme: Theme
}

const NotesLayout = ({ user, notes, notesLoading, notesError, creating, submitting, onCreate, onDelete, onLogout, onRename, onToggleTheme, theme }: NotesLayoutProps) => {
  return (
    <div className={styles.shell}>
        <Sidebar
          user={user}
          notes={notes}
          notesLoading={notesLoading}
          notesError={notesError}
          creating={creating}
          submitting={submitting}
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
