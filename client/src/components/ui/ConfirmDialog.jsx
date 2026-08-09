import Modal from './Modal'
import Button from './Button'
import styles from './ConfirmDialog.module.css'

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  error,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  loading = false,
}) => {
  return (
    <Modal open={open} onClose={onClose} title={title}>

      <p className="copy-14">{message}</p>

      {error && <p className="label-12 text-danger">{error}</p>}

      <div className={styles.footer}>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button variant={variant} onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
