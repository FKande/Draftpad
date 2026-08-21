import { useState } from 'react'
import styles from './Sidebar.module.css'
import Button from './components/ui/Button'
import Wordmark from './components/Wordmark'
import { CircleUser } from 'lucide-react'
import NoteRow from './NoteRow'
import SettingsDialog from './SettingsDialog'
import type { Note, User } from './api'
import type { Theme } from './App'

type SidebarProps = {
  user: User | null
  notes: Note[]
  notesLoading: boolean
  notesError: boolean
  creating: boolean
  onCreate: () => void
  onDelete: (id: string) => Promise<void>
  onRename: (id: string, newTitle: string) => Promise<void>
  onLogout: () => void
  submitting: boolean
  onToggleTheme: () => void
  theme: Theme
}

const Sidebar = ({
  user,
  notes,
  notesLoading,
  notesError,
  creating,
  onCreate,
  onDelete,
  onRename,
  onLogout,
  submitting,
  onToggleTheme,
  theme
}: SidebarProps) => {

  const [ settingsOpen, setSettingsOpen ] = useState(false)


  return (
    <aside className={styles.sidebar}>

      <header className={styles.header}>
        <Wordmark size={20} />
        <Button
          variant="secondary"
          fullWidth
          onClick={onCreate}
          loading={creating}
        >
          New note
        </Button>
      </header>


      <nav className={styles.list}>

        {notesLoading && <p className="label-12">Loading your notes...</p>}

        {notesError && (
          <p className="label-12 text-danger">Your notes could not be loaded, please try refreshing the page.</p>
        )}

        {!notesLoading &&
          !notesError &&
          (notes.length === 0 ? (
            <p className="label-12">You don't have any notes yet, create one to get started.</p>
          ) : (
            <ul>
              {notes.map((individualNote) => (
                <NoteRow key={individualNote.id} note={individualNote} onDelete={onDelete} onRename={onRename}/>
              ))}
            </ul>
          ))}
      </nav>

      <button className={`label-14 ${styles.account}`} onClick={() => setSettingsOpen(true)} aria-haspopup="dialog">
        <CircleUser className={styles.accountIcon} />
        <span className={styles.accountEmail}>{user?.email}</span>
      </button>

      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Settings"
        onLogout={onLogout}
        submitting={submitting}
        onToggleTheme={onToggleTheme}
        theme={theme}
      />

    </aside>
  )
}

export default Sidebar
