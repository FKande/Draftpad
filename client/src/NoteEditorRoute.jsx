import { useParams, Navigate } from 'react-router-dom'
import NoteEditor from './NoteEditor'

const NoteEditorRoute = ({ notes, notesLoading, onContentChange, onBack }) => {
  const { id } = useParams()
  const note = notes.find((n) => n.id === id)

  if (notesLoading) return <p>loading...</p>
  if (!note) return <Navigate to="/notes" replace />

  return (
    <NoteEditor
      note={note}
      onContentChange={(newContent) => onContentChange(id, newContent)}
      onBack={onBack}
    />
  )
}

export default NoteEditorRoute
