import express from 'express'
import { z } from 'zod'
import { signup } from '../services/authService.js'

const router = express.Router()

// define the validation schema
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
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

export default router
