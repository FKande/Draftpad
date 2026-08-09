import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Ellipsis } from 'lucide-react'
import Button from './components/ui/Button.jsx'
import styles from './NoteRow.module.css'
import Menu from './components/ui/Menu.jsx'
import ConfirmDialog from './components/ui/ConfirmDialog.jsx'

const NoteRow = ({ note, onDelete }) => {

  const [ menuOpen, setMenuOpen ] = useState(false)

  const [ activeDialog, setActiveDialog ] = useState(null)

  const [ deleteError, setDeleteError ] = useState(null)
  const [ deleting, setDeleting ] = useState(false)

  const handleDelete = async (id) => {
    setDeleteError(null)
    setDeleting(true)

    try {
      await onDelete(id)
    } catch {
      setDeleteError("We couldn't delete your note, please try again later.")
    } finally {
      setDeleting(false)
    }

  }

  const handleDialogClose = () => {
    if (deleting) return
    setActiveDialog(null)
    setDeleteError(null)
  }

  return (
    <li className={styles.row}>
      <NavLink
        to={`/notes/${note.id}`}
        className={({ isActive }) =>
          `link-plain label-16 ${styles.link} ${isActive ? styles.linkActive : ''}`
        }
      >
        {note.title}
      </NavLink>

      <Button
        variant="ghost"
        size="sm"
        iconOnly
        iconLeft={<Ellipsis />}
        aria-label="Note options"
        className={styles.trigger}
        onClick={() => setMenuOpen(!menuOpen)}
      />
      {menuOpen &&
        <Menu
          onClose={() => setMenuOpen(false)}
          items={[
            { label: 'Rename', onSelect: () => setActiveDialog('Rename') },
            { label: 'Delete', onSelect: () => setActiveDialog('Delete') }
          ]}
      />}

      <ConfirmDialog
        open={activeDialog === 'Delete'}
        title="Delete note?"
        message={`"${note.title}" will be permanently deleted. Are you sure you would like to proceed?`}
        onConfirm={() => handleDelete(note.id)}
        onClose={handleDialogClose}
        variant="danger"
        confirmLabel="Delete"
        loading={deleting}
        error={deleteError}
      />

    </li>
  )
}


export default NoteRow
