import styles from './Menu.module.css'
import { useRef, useEffect } from 'react';

interface MenuItem {
  label: string
  onSelect: () => void
}

type MenuProps = {
  items: MenuItem[]
  onClose: () => void
}

const Menu = ({ items, onClose }: MenuProps) => {

  const panelRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!panelRef.current) return
      if (!panelRef.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])


  useEffect(() => {

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        if (!panelRef.current) return
        const buttons = Array.from(panelRef.current.querySelectorAll('button'))
        const currentIndex = buttons.findIndex(
          (button) => button === document.activeElement,
        )
        const direction = e.key === 'ArrowDown' ? 1 : -1
        const nextIndex = (currentIndex + direction + buttons.length) % buttons.length
        buttons[nextIndex]?.focus()
      }

    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)

  }, [onClose])

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
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
