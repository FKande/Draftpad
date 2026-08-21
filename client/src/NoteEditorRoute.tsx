import { useParams, Navigate } from 'react-router-dom'
import NoteEditor from './NoteEditor'
import { useEffect } from 'react'
import { getNoteById } from './api'
import type { Note } from './api'

type NoteEditorRouteProps = {
  notes: Note[]
  notesLoading: boolean
  onContentChange: (id: string, newContent: string) => void
  onTitleChange: (id: string, newTitle: string) => void
  onDirtyChange: (id: string | null) => void
  onNoteFetched: (note: Note) => void
}

const NoteEditorRoute = ({ notes, notesLoading, onContentChange, onTitleChange, onDirtyChange, onNoteFetched }: NoteEditorRouteProps) => {

  const { id } = useParams()
  const note = notes.find((n) => n.id === id)

  useEffect(() => {
    if (!id) return
    // Re-binding because the !id narrowing does not reach into fetchNote.
    const noteId = id
    async function fetchNote() {
      try {
        const fetched = await getNoteById(noteId)
        onNoteFetched(fetched)
      } catch {
        console.log('There was an error with fetching the new note from the server.')
      }
    }
    fetchNote()
    // onNoteFetched is recreated on every render of App, so including it here
    // caused an infinite loop: fetch -> setNotes -> re-render -> new function
    // identity -> fetch again. Proper fix is useCallback in App.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (notesLoading) return <p>loading...</p>
  if (!note) return <Navigate to="/notes" replace />

  return (
    <NoteEditor
      note={note}
      onContentChange={(newContent) => onContentChange(note.id, newContent)}
      onTitleChange={(newTitle) => onTitleChange(note.id, newTitle)}
      key={note.id}
      onDirtyChange={onDirtyChange}
    />
  )
}

export default NoteEditorRoute
