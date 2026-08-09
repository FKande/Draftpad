import Modal from "./components/ui/Modal"
import Button from "./components/ui/Button"

const SettingsDialog = ({
  open,
  onClose,
  onLogout,
  submitting,
  title
  }) => {

  return (
    <Modal open={open} onClose={onClose} title={title}>

      <Button variant="secondary" onClick={onLogout} loading={submitting}>
        Logout
      </Button>
    </Modal>
  )
}

export default SettingsDialog
