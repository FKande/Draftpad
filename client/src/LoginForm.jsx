import { useState } from 'react'
import { login } from './api'
import { Link } from 'react-router-dom'

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const user = await login(email, password)
      onLogin(user)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
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

      <Link to="/signup">don't have an account? create one</Link>

      {error && <p>{error}</p>}
    </section>
  )
}

export default LoginForm
