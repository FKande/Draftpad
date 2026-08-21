import Modal from "./components/ui/Modal"
import Button from "./components/ui/Button"
import type { Theme } from './App'

type SettingsDialogProps = {
  open: boolean
  onClose: () => void
  onLogout: () => void
  submitting: boolean
  title: string
  onToggleTheme: () => void
  theme: Theme
}

const SettingsDialog = ({
  open,
  onClose,
  onLogout,
  submitting,
  title,
  onToggleTheme,
  theme
  }: SettingsDialogProps) => {

  return (
    <Modal open={open} onClose={onClose} title={title}>

      <Button variant="secondary" onClick={onToggleTheme}>
        {theme === 'light' ? 'Switch to dark' : 'Switch to light'}
      </Button>

      <Button variant="secondary" onClick={onLogout} loading={submitting}>
        Logout
      </Button>
    </Modal>
  )
}

export default SettingsDialog
