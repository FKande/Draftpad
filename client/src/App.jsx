import { useState, useEffect } from "react"
import { getMe, logout, getNotes, createNote } from "./api"
import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"
import NoteEditor from "./NoteEditor"

function App() {

  const [ user, setUser ] = useState(null)
  const [ loading, setLoading ] = useState(true)

  const [ error, setError ] = useState(null)
  const [ submitting, setSubmitting ] = useState(false)

  const [ authError, setAuthError ] = useState(false)

  const [ showSignup, setShowSignup ] = useState(false)

  const [ notes, setNotes ] = useState([])
  const [ notesLoading, setNotesLoading ] = useState(true)
  const [ notesError, setNotesError ] = useState(false)

  const [ creating, setCreating ] = useState(false)

  const [ selectedNoteId, setSelectedNoteId ] = useState(null)

  useEffect(() => {
    async function checkAuth() {
      try {
        const me = await getMe()
        setUser(me)
      } catch (err) {
        if (err.status === 401) {
          setUser(null)
        } else {
          setAuthError(true)
        }
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    if (!user) return

    async function loadNotes() {

      setNotesLoading(true)
      setNotesError(false)
      setNotes([])

      try {
        const fetchedNotes = await getNotes()
        setNotes(fetchedNotes)
      } catch {
        setNotesError(true)
      } finally {
        setNotesLoading(false)
      }
    }
    loadNotes()
  }, [user])


  const handleLogout = async () => {
    setError(null)
    setSubmitting(true)

    try {
      await logout()
      setUser(null)
      setNotes([])
    } catch {
      setError('Could not log out, try again')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCreateNote = async () => {
    setError(null)
    setCreating(true)

    try {
      const newNote = await createNote()
      setNotes((prev) => [...prev, newNote])
    } catch {
      setError('Could not create note, try again')
    } finally {
      setCreating(false)
    }
  }

  const selectedNote = notes.find((note) => note.id === selectedNoteId)

  const handleContentChange = (newContent) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === selectedNoteId ? { ...note, content: newContent } : note
      )
    )
  }

  if (loading) return <p>loading...</p>
  if (authError) return <p>Something went wrong. Please refresh.</p>

  if (user) {
    return (
      <section className="vertical-section">
      {selectedNoteId ?
        <NoteEditor key={selectedNoteId} note={selectedNote} onContentChange={handleContentChange} onBack={() => setSelectedNoteId(null)} />
        :
        <div>
          <p>logged in as {user.email}</p>
          <button onClick={handleLogout} disabled={submitting}>
            {submitting ? 'logging out...' : 'logout'}
          </button>

          {error && <p>{error}</p>}

          {notesLoading && <p>loading your notes...</p>}
          {notesError && <p>your notes could not be loaded, please try refreshing the page</p>}

          {!notesLoading && !notesError && (
            notes.length === 0
            ? <p>no notes yet</p>
            :
            <ul>
              {notes.map((individualNote) => (
                <li key={individualNote.id} onClick={() => setSelectedNoteId(individualNote.id)}>
                  {individualNote.title}
                </li>
              ))}
            </ul>
          )}

          <button onClick={handleCreateNote} disabled={creating}>
            {creating ? 'creating note...' : '+ create a new note'}
          </button>
        </div>
      }
      </section>
    )
  }

  if (showSignup) {
    return <SignupForm onSignup={setUser} onSwitchToLogin={() => setShowSignup(false)}/>
  }

  return <LoginForm onLogin={setUser} onSwitchToSignup={() => setShowSignup(true)}/>
}

export default App
