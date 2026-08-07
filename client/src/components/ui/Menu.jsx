import styles from './Menu.module.css'
import { useRef, useEffect } from 'react';

const Menu = ({ items, onClose }) => {

  const panelRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!panelRef.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])


  useEffect(() => {

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        let buttons = Array.from(panelRef.current.querySelectorAll('button'))
        const currentIndex = buttons.indexOf(document.activeElement)
        const direction = e.key === 'ArrowDown' ? 1 : -1
        const nextIndex = (currentIndex + direction + buttons.length) % buttons.length
        buttons[nextIndex].focus()
      }

    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)

  }, [onClose])

  useEffect(() => {
    const previouslyFocused = document.activeElement
    return () => previouslyFocused?.focus()
  }, [])

  return (
    <ul className={styles.panel} ref={panelRef}>
      {items.map((item) => (
        <li key={item.label}>
          <button
            className={`label-14 ${styles.item}`}
            onClick={() => { item.onSelect(); onClose() }}
          >
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  )
}

export default Menu
