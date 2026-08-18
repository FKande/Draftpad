import express from 'express'
import { z } from 'zod'
import { signup, login, logout } from '../services/authService.js'
import { requireAuth } from '../middleware/requireAuth.js'

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
    const { token, user } = await signup(email, password)
    res.cookie('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    return res.status(201).json(user)
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
    const { token, user } = await login(email, password)
    res.cookie('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    return res.status(200).json(user)
  } catch (err) {
    return res.status(401).json({ error: err.message })
  }
})

router.post('/logout', async (req, res) => {
  const token = req.cookies.session
  if (token) {
    await logout(token)
  }
  res.clearCookie('session', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  })
  return res.status(200).json({ success: true })
})

router.get('/me', requireAuth, (req, res) => {
  return res.status(200).json(req.user)
})

export default router
