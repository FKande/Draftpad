import { useState, useEffect } from 'react'
import { getMe, logout, getNotes, createNote, deleteNote, updateNote } from './api'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import RequireAuth from './RequireAuth'
import NoteEditorRoute from './NoteEditorRoute'
import NotesLayout from './NotesLayout'
import AuthLayout from './components/AuthLayout'

function App() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [authError, setAuthError] = useState(false)

  const [notes, setNotes] = useState([])
  const [notesLoading, setNotesLoading] = useState(true)
  const [notesError, setNotesError] = useState(false)

  const [creating, setCreating] = useState(false)

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') ?? 'light')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const handleAuthSuccess = (loggedInUser) => {
    setUser(loggedInUser)
    navigate('/notes')
  }

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

  const handleDeleteNote = async (id) => {

    await deleteNote(id)
    setNotes((prev) => prev.filter((note) => note.id !== id))

  }

  const handleTitleChange = (id, newTitle) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, title: newTitle } : note,
      ),
    )
  }

  const handleRenameNote = async (id, newTitle) => {
    await updateNote(id, { title: newTitle })
    handleTitleChange(id, newTitle)
  }

  const handleContentChange = (id, newContent) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, content: newContent } : note,
      ),
    )
  }

  if (loading) return <p>loading...</p>
  if (authError) return <p>Something went wrong. Please refresh.</p>

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/notes" />} />
      <Route
        path="/login"
        element={
          user ? <Navigate to="/notes" replace /> : (
            <AuthLayout>
              <LoginForm onLogin={handleAuthSuccess} />
            </AuthLayout>
          )
        }
      />
      <Route
        path="/signup"
        element={
          user ? <Navigate to="/notes" replace /> : (
            <AuthLayout>
              <SignupForm onSignup={handleAuthSuccess} />
            </AuthLayout>
          )
        }
      />
      <Route
        path="/notes"
        element={
          <RequireAuth user={user}>
            <NotesLayout
              user={user}
              notes={notes}
              notesLoading={notesLoading}
              notesError={notesError}
              creating={creating}
              submitting={submitting}
              error={error}
              onCreate={handleCreateNote}
              onDelete={handleDeleteNote}
              onLogout={handleLogout}
              onRename={handleRenameNote}
              onToggleTheme={toggleTheme}
              theme={theme}
            />
          </RequireAuth>
        }
      >
        <Route index element={<p>pick a note</p>} />
        <Route path=":id" element={
          <NoteEditorRoute
            notes={notes}
            notesLoading={notesLoading}
            onContentChange={handleContentChange}
            onTitleChange={handleTitleChange}
          />
        }/>
      </Route>
    </Routes>
  )
}

export default App
