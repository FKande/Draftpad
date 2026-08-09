import Modal from './Modal'
import Button from './Button'
import DialogFooter from './DialogFooter'

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

      <DialogFooter>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button variant={variant} onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </DialogFooter>
    </Modal>
  )
}

export default ConfirmDialog
