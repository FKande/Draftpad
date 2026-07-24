import express from 'express'
import { z } from 'zod'
import { signup, login } from '../services/authService.js'

const router = express.Router()

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

router.post('/signup', async (req, res) => {
  const result = signupSchema.safeParse(req.body)

  if (!result.success) {
    return res.status(400).json({ error: result.error })
  }

  const email = result.data.email
  const password = result.data.password

  try {
    const newUser = await signup(email, password)
    return res.status(201).json(newUser)
  } catch (err) {
    return res.status(409).json({ error: err.message })
  }
})

router.post('/login', async (req, res) => {
  const result = loginSchema.safeParse(req.body)

  if (!result.success) {
    return res.status(400).json({ error: result.error })
  }

  const email = result.data.email
  const password = result.data.password

  try {
    const token = await login(email, password)
    res.cookie('session', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    return res.status(200).json({ success: true })
  } catch (err) {
    return res.status(401).json({ error: err.message })
  }
})

export default router
