import { useState } from 'react'
import styles from './Sidebar.module.css'
import Button from './components/ui/Button.jsx'
import Wordmark from './components/Wordmark.jsx'
import { CircleUser } from 'lucide-react'
import NoteRow from './NoteRow.jsx'
import SettingsDialog from './SettingsDialog.jsx'

const Sidebar = ({
  user,
  notes,
  notesLoading,
  notesError,
  creating,
  error,
  onCreate,
  onDelete,
  onRename,
  onLogout,
  submitting
}) => {

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

        {error && <p className="label-12 text-danger">{error}</p>}

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
        <span className={styles.accountEmail}>{user.email}</span>
      </button>

      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Settings"
        onLogout={onLogout}
        submitting={submitting}
      />

    </aside>
  )
}

export default Sidebar
