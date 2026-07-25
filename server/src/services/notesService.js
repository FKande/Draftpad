import { db } from '../db/index.js'
import { notes } from '../db/schema.js'
import { eq } from 'drizzle-orm'

export async function createNote(userId, title, content) {
  const [note] = await db
    .insert(notes)
    .values({ userId, title, content })
    .returning()
  return note
}

export async function getNotes(userId) {
  const userNotesArray = await db
    .select()
    .from(notes)
    .where(eq(notes.userId, userId))
  return userNotesArray
}
