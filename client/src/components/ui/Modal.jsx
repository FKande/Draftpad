import { useRef, useEffect } from 'react'
import styles from './Modal.module.css'

const Modal = ({ open, onClose, title, children }) => {
  const dialogRef = useRef(null)

  useEffect(() => {

    const dialog = dialogRef.current
    if (!dialog) return

    if (open) {
      dialog.showModal()
    } else {
      dialog.close()
    }

  }, [open])

  const handleClick = (e) => {
    if (e.target === dialogRef.current) onClose()
  }


  return (
    <dialog ref={dialogRef} onClose={onClose} onClick={handleClick} className={styles.dialog}>
      <div className={styles.surface}>
        <header className={styles.header}>
          <h2 className="heading-20">{title}</h2>
        </header>
        {children}
      </div>
    </dialog>
  )
}

export default Modal
