import express from 'express'
import { z } from 'zod'
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  getNoteById,
} from '../services/notesService.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { validateUuidParam } from '../middleware/validateUuidParam.js'

const router = express.Router()

const noteSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
})

const updateSchema = z.object({
  title: z.string().min(1).optional(),
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

router.patch('/:id', requireAuth, validateUuidParam, async (req, res) => {
  const result = updateSchema.safeParse(req.body)

  if (!result.success) {
    return res.status(400).json({ error: result.error })
  }

  const title = result.data.title
  const content = result.data.content
  const noteId = req.params.id
  const userId = req.user.id

  const updated = await updateNote(userId, noteId, title, content)
  if (!updated) {
    return res.status(404).json({ error: 'Note does not exist' })
  }
  return res.status(200).json(updated)
})

router.delete('/:id', requireAuth, validateUuidParam, async (req, res) => {
  const noteId = req.params.id
  const userId = req.user.id

  const deleted = await deleteNote(userId, noteId)

  if (!deleted) {
    return res.status(404).json({ error: 'Note does not exist' })
  }

  return res.status(204).end()
})

router.get('/:id', requireAuth, validateUuidParam, async (req, res) => {
  const noteId = req.params.id
  const userId = req.user.id

  const note = await getNoteById(userId, noteId)

  if (!note) {
    return res.status(404).json({ error: 'Note does not exist' })
  }

  return res.status(200).json(note)
})

export default router
