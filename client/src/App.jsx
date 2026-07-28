import { useState, useEffect } from "react"
import { getMe, login, logout } from "./api"

function App() {

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
  
    try {
      const user = await login(email, password)
      setUser(user)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = async () => {
    setError(null)
    setSubmitting(true)

    try {
      await logout()
      setUser(null)
      setEmail('')
      setPassword('')
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
    
  return (
    <section className="vertical-section">
        <span>login</span>
        <form onSubmit={handleSubmit} className="form-body">
          <label>email</label>
          <input 
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>password</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" disabled={submitting}>
            {submitting ? 'loading...' : 'login'}
          </button>
        </form>

        {error && <p>{error}</p>}

    </section>
  )
}

export default App