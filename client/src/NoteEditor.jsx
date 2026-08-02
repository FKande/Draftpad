import { useState, useEffect } from 'react'
import { updateNote } from './api'

const NoteEditor = ({ note, onContentChange }) => {
  const content = note.content ?? ''

  const [lastSavedContent, setLastSavedContent] = useState(content)
  const [saveError, setSaveError] = useState(false)

  useEffect(() => {
    if (content === lastSavedContent) return

    const timerId = setTimeout(() => {
      async function save() {
        try {
          setSaveError(false)
          await updateNote(note.id, undefined, content)
          setLastSavedContent(content)
        } catch {
          setSaveError(true)
        }
      }
      save()
    }, 500)

    return () => clearTimeout(timerId)
  }, [content, note.id, lastSavedContent])

  const unsaved = content !== lastSavedContent

  return (
    <div className="vertical-column">
      <span>{note.title}</span>

      {saveError ? (
        <p>couldn't save; your changes are still here</p>
      ) : unsaved ? (
        <p>saving...</p>
      ) : (
        <p>all changes saved</p>
      )}
      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
      />
    </div>
  )
}

export default NoteEditor
