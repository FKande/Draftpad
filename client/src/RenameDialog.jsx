import { useState } from 'react'
import Modal from './components/ui/Modal'
import Button from './components/ui/Button'
import DialogFooter from './components/ui/DialogFooter'
import Form from './components/ui/Form'
import FormField from './components/ui/FormField'

const RenameDialog = ({
    open,
    onClose,
    onRename,
    title,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'primary',
    note
  }) => {

  const [ draft, setDraft ] = useState(note.title)

  const [ renameError, setRenameError ] = useState(null)
  const [ renaming, setRenaming ] = useState(false)


  const handleSubmit = async (e) => {
    e.preventDefault()
    setRenameError(null)
    setRenaming(true)

    try {
      await onRename(note.id, draft)
      onClose()
    } catch {
      setRenameError("We couldn't rename your note, please try again later.")
    } finally {
      setRenaming(false)
    }

  }

  const handleClose = () => {
    if (renaming) return
    setRenameError(null)
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title={title}>


      <Form onSubmit={handleSubmit}>
        <FormField
          label="New name"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={50}
        />

        {renameError && <p className="label-12 text-danger">{renameError}</p>}

        <DialogFooter>
          <Button variant="secondary" type="button" onClick={handleClose} disabled={renaming}>
            {cancelLabel}
          </Button>
          <Button variant={variant} type="submit" loading={renaming}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </Form>
    </Modal>
  )
}

export default RenameDialog
