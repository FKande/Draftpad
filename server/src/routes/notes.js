import express from 'express'
import { z } from 'zod'
import { createNote, getNotes } from '../services/notesService.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()

const noteSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
})

router.post('/', requireAuth, async (req, res) => {
  const result = noteSchema.safeParse(req.body)

  if (!result.success) {
    return res.status(400).json({ error: result.error })
  }

  const title = result.data.title
  const content = result.data.content

  const createdNote = await createNote(req.user.id, title, content)
  return res.status(201).json(createdNote)
})

router.get('/', requireAuth, async (req, res) => {
  const userNotesArray = await getNotes(req.user.id)
  return res.status(200).json(userNotesArray)
})

export default router
