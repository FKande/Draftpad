import { describe, it, expect, beforeEach } from 'vitest'
import { db } from '../src/db/index.js'
import { notes, sessions, users } from '../src/db/schema.js'
import { createNote, getNotes, getNoteById, updateNote, deleteNote } from '../src/services/notesService.js'

let userA
let userB

beforeEach(async () => {
  await db.delete(notes)
  await db.delete(sessions)
  await db.delete(users)

  // Insert users directly rather than via signup() so these tests
  // fail only when the notes service is broken, not the auth service.
  const rowsA = await db.insert(users).values({ email: 'userA@mail.com', passwordHash: 'fakeHashA' }).returning()
  userA = rowsA[0]
  const rowsB = await db.insert(users).values({ email: 'userB@mail.com', passwordHash: 'fakeHashB' }).returning()
  userB = rowsB[0]
})

describe('createNote', () => {
  it('creates a note owned by the given user', async () => {
    const createdNote = await createNote(userA.id, 'some title', 'some content')
    expect(createdNote.userId).toBe(userA.id)
  })
})

describe('getNotes', () => {
  it('returns only the requesting user\'s notes', async () => {
    await createNote(userA.id, 'some title', 'some content')
    await createNote(userB.id, 'some title', 'some content')
    const result = await getNotes(userA.id)
    const noteOfInterest = result[0]
    expect(result).toHaveLength(1)
    expect(noteOfInterest.userId).toBe(userA.id)
  })
})

describe('getNoteById', () => {
  it('returns the note for its owner', async () => {
    const created = await createNote(userA.id, 'some title', 'some content')
    const fetched = await getNoteById(userA.id, created.id)
    expect(created.id).toBe(fetched.id)
  })
  it('returns undefined for a different user', async () => {
    const created = await createNote(userA.id, 'some title', 'some content')
    const fetched = await getNoteById(userB.id, created.id)
    expect(fetched).toBeUndefined()
  })
})

describe('updateNote', () => {
  it('updates fields and bumps updatedAt', async () => {
    const created = await createNote(userA.id, 'some title', 'some content')
    const ogUpdatedAt = created.updatedAt
    await new Promise((resolve) => setTimeout(resolve, 5))
    const updated = await updateNote(userA.id, created.id, 'new title', 'some content')
    expect(updated.title).toBe('new title')
    expect(updated.updatedAt.getTime()).toBeGreaterThan(ogUpdatedAt.getTime())
  })

  it('returns undefined for a different user', async () => {
    const created = await createNote(userA.id, 'some title', 'some content')
    const updated = await updateNote(userB.id, created.id, 'new title', 'some content')
    expect(updated).toBeUndefined()
  })
})

describe('deleteNote', () => {
  it('removes the row', async () => {
    const created = await createNote(userA.id, 'some title', 'some content')
    await deleteNote(userA.id, created.id)
    const fetched = await getNoteById(userA.id, created.id)
    expect(fetched).toBeUndefined()
  })
  it('returns undefined for a different user', async () => {
    const created = await createNote(userA.id, 'some title', 'some content')
    const deleteAttempt = await deleteNote(userB.id, created.id)
    expect(deleteAttempt).toBeUndefined()
    const fetched = await getNoteById(userA.id, created.id)
    expect(fetched).toBeDefined()
  })
})