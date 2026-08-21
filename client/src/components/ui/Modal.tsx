import { useRef, useEffect } from 'react'
import styles from './Modal.module.css'

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

const Modal = ({ open, onClose, title, children }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {

    const dialog = dialogRef.current
    if (!dialog) return

    if (open) {
      dialog.showModal()
    } else {
      dialog.close()
    }

  }, [open])

  const handleClick = (e: React.MouseEvent<HTMLDialogElement>) => {
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
