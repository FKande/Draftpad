import { useState } from 'react'
import { signup } from './api'
import { Link } from 'react-router-dom'
import Button from './components/ui/Button'
import Form from './components/ui/Form'
import FormField from './components/ui/FormField'
import Fieldset from './components/ui/Fieldset'

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
    <>
      <h1 className="heading-24">Sign up</h1>

      <Form onSubmit={handleSubmit}>

        <Fieldset>
          <FormField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FormField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={
              password && !passwordLongEnough
                ? 'Must be at least 8 characters'
                : null
            }
          />

          <FormField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            error={
              confirmPassword && !passwordsMatch ? 'Passwords do not match' : null
            }
          />

          {error && <p className="label-12 text-danger">{error}</p>}

        </Fieldset>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={submitting}
          disabled={!passwordsMatch || !passwordLongEnough}
        >
          Sign up
        </Button>
      </Form>

      <Link className="label-14" to="/login">Already have an account? Login</Link>
    </>
  )
}

export default SignupForm
