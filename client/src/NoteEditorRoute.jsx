import { useParams, Navigate } from 'react-router-dom'
import NoteEditor from './NoteEditor'
import { useEffect } from 'react'
import { getNoteById } from './api'

const NoteEditorRoute = ({ notes, notesLoading, onContentChange, onTitleChange, onDirtyChange, onNoteFetched }) => {

  const { id } = useParams()
  const note = notes.find((n) => n.id === id)

  useEffect(() => {
    async function fetchNote() {
      try {
        const fetched = await getNoteById(id)
        onNoteFetched(fetched)
      } catch {
        console.log('There was an error with fetching the new note from the server.')
      }
    }
    fetchNote()
  }, [id, onNoteFetched])

  if (notesLoading) return <p>loading...</p>
  if (!note) return <Navigate to="/notes" replace />

  return (
    <NoteEditor
      note={note}
      onContentChange={(newContent) => onContentChange(id, newContent)}
      onTitleChange={(newTitle) => onTitleChange(id, newTitle)}
      key={note.id}
      onDirtyChange={onDirtyChange}
    />
  )
}

export default NoteEditorRoute
