import { useState } from "react"
import { signup } from "./api"
import { Link } from 'react-router-dom'

const SignupForm = ({ onSignup }) => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const user = await signup(email, password)
      onSignup(user)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const passwordsMatch = password === confirmPassword
  const passwordLongEnough = password.length >= 8

  return (
    <section className="vertical-section">
      <span>sign up</span>
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

        <label>confirm password</label>
        <input
          required
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit" disabled={submitting || !passwordsMatch || !passwordLongEnough}>
          {submitting ? 'loading...' : 'sign up'}
        </button>
      </form>

      {password && !passwordLongEnough && <p>Password must be at least 8 characters</p>}
      {confirmPassword && !passwordsMatch && <p>Passwords do not match</p>}

      <Link to="/login">already have an account? login</Link>

      {error && <p>{error}</p>}

    </section>
  )
}

export default SignupForm
