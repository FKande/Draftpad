import styles from './Sidebar.module.css'
import Button from './components/ui/Button.jsx'
import Wordmark from './components/Wordmark.jsx'
import { CircleUser } from 'lucide-react'
import NoteRow from './NoteRow.jsx'

const Sidebar = ({
  user,
  notes,
  notesLoading,
  notesError,
  creating,
  error,
  onCreate,
  onDelete
}) => {
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
                <NoteRow key={individualNote.id} note={individualNote} onDelete={onDelete}/>
              ))}
            </ul>
          ))}
      </nav>

      <footer className={`label-14 ${styles.account}`}>
        <CircleUser className={styles.accountIcon} strokeWidth={1.5} />
        <span className={styles.accountEmail}>{user.email}</span>
      </footer>


    </aside>
  )
}

export default Sidebar
