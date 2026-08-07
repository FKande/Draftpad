import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Ellipsis } from 'lucide-react'
import Button from './components/ui/Button.jsx'
import styles from './NoteRow.module.css'
import Menu from './components/ui/Menu.jsx'

const NoteRow = ({ note }) => {

  const [ menuOpen, setMenuOpen ] = useState(false)

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
            { label: 'Rename', onSelect: () => console.log('rename', note.id) },
            { label: 'Delete', onSelect: () => console.log('delete', note.id) }
          ]}
        />}
    </li>
  )
}

export default NoteRow
