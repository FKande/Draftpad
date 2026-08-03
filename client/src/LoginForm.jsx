import { useState } from 'react'
import { login } from './api'
import { Link } from 'react-router-dom'
import Button from './components/ui/Button'
import Form from './components/ui/Form'
import FormField from './components/ui/FormField'
import Fieldset from './components/ui/Fieldset'

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
    <>
      <h1 className="heading-24">Login</h1>

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
          />

          {error && <p className="label-12 text-danger">{error}</p>}

        </Fieldset>

        <Button type="submit" variant="primary" size="md" fullWidth loading={submitting}>
          Login
        </Button>

      </Form>

      <Link className="label-14" to="/signup">Don't have an account? Create one</Link>

    </>
  )
}

export default LoginForm
