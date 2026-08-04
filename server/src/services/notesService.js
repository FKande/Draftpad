import { db } from '../db/index.js'
import { notes } from '../db/schema.js'
import { eq, and, sql, desc } from 'drizzle-orm'

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
    .orderBy(desc(notes.updatedAt))
  return userNotesArray
}

export async function updateNote(userId, noteId, title, content) {

  const [updatedNote] =  await db.update(notes)
    .set({ title, content, updatedAt: sql`now()` })
    .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
    .returning()

  return updatedNote
}

export async function deleteNote(userId, noteId) {
  const [deletedNote] = await db.delete(notes)
  .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
  .returning()

  return deletedNote
}

export async function getNoteById(userId, noteId) {
  const [singleNote] = await db.select()
  .from(notes)
  .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))

  return singleNote
}
