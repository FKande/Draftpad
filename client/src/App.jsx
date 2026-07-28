import { useState, useEffect } from "react"
import { getMe, logout } from "./api"
import LoginForm from "./LoginForm"

function App() {

  const [ user, setUser ] = useState(null)
  const [ loading, setLoading ] = useState(true)

  const [ error, setError ] = useState(null)
  const [ submitting, setSubmitting ] = useState(false)

  const [ authError, setAuthError ] = useState(false)

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


  const handleLogout = async () => {
    setError(null)
    setSubmitting(true)

    try {
      await logout()
      setUser(null)
    } catch {
      setError('Could not log out, try again')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p>loading...</p>
  if (authError) return <p>Something went wrong. Please refresh.</p>

  if (user) {
    return (
      <div>
        <p>logged in as {user.email}</p>
        <button onClick={handleLogout} disabled={submitting}>
          {submitting ? 'logging out...' : 'logout'}
        </button>
        {error && <p>{error}</p>}
      </div>
    )
  }

  return <LoginForm onLogin={setUser} />
}

export default App
