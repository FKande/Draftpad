import { NavLink } from 'react-router-dom'
import { Ellipsis } from 'lucide-react'
import Button from './components/ui/Button.jsx'
import styles from './NoteRow.module.css'

const NoteRow = ({ note }) => {
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
        onClick={() => console.log('menu for', note.id)}
      />
    </li>
  )
}

export default NoteRow
