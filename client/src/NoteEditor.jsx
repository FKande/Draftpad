import { useState, useEffect } from 'react'
import { updateNote } from './api'

const NoteEditor = ({ note, onContentChange, onBack }) => {

  const [ lastSavedContent, setLastSavedContent ] = useState(note.content ?? '')
  const [ saveError, setSaveError ] = useState(false)

  useEffect(() => {
    if (note.content === lastSavedContent) return

    const timerId = setTimeout(() => {
      async function save() {
        try {
          setSaveError(false)
          await updateNote(note.id, undefined, note.content)
          setLastSavedContent(note.content)
        } catch {
          setSaveError(true)
        }
      }
      save()

    }, 500)

    return () => clearTimeout(timerId)

  }, [note.content, note.id, lastSavedContent])

  const unsaved = note.content !== lastSavedContent

  // Fire and forget: the component is unmounting, so there's nowhere to
  // surface a failure. Swallowing it until App owns a toast system.
  const handleBack = () => {
    if (unsaved) {
      updateNote(note.id, undefined, note.content).catch(() => {})
    }
    onBack()
  }

  return (
    <div className="vertical-column">
      <span>{note.title}</span>

      {saveError ? <p>couldn't save; your changes are still here</p> : unsaved ? <p>saving...</p> : <p>all changes saved</p>}
      <textarea
        value={note.content ?? ''}
        onChange={(e) => onContentChange(e.target.value)}

      />

      <button onClick={handleBack}>
        {'<'} go back
      </button>
    </div>
  )
}

export default NoteEditor
