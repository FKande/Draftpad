import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'
import { db } from '../src/db/index.js'
import { notes, sessions, users } from '../src/db/schema.js'
import { signup } from '../src/services/authService.js'

let cookie

beforeEach(async () => {
  await db.delete(notes)
  await db.delete(sessions)
  await db.delete(users)
  await signup('me@example.com', 'password123')
  const loginResponse = await request(app)
    .post('/auth/login')
    .send({ email: 'me@example.com', password: 'password123' })
  cookie = loginResponse.headers['set-cookie']
})

describe('notes routes', () => {
  it('returns 401 without a session cookie', async () => {
    const notesRes = await request(app).get('/notes')
    expect(notesRes.status).toBe(401)
  })

  it('returns 400 for a malformed uuid', async () => {
    const notesRes = await request(app).get('/notes/not-a-uuid').set('Cookie', cookie)
    expect(notesRes.status).toBe(400)
  })

  it('supports the full note lifecycle', async () => {

    const createRes = await request(app)
        .post('/notes')
        .set('Cookie', cookie)
        .send({ title: 'first', content: 'body' })
    expect(createRes.status).toBe(201)
    const id = createRes.body.id

    const getNotesRes = await request(app)
        .get('/notes')
        .set('Cookie', cookie)
    expect(getNotesRes.status).toBe(200)
    expect(getNotesRes.body).toHaveLength(1)

    const getNotesId = await request(app)
        .get(`/notes/${id}`)
        .set('Cookie', cookie)
    expect(getNotesId.status).toBe(200)

    const patchTitleRes = await request(app) 
        .patch(`/notes/${id}`)
        .set('Cookie', cookie)
        .send({ title: 'new title' })
    expect(patchTitleRes.status).toBe(200)
    expect(patchTitleRes.body.title).toBe('new title')

    const deleteNoteRes = await request(app)
        .delete(`/notes/${id}`)
        .set('Cookie', cookie)
    expect(deleteNoteRes.status).toBe(204)

    const getDeletedId = await request(app)
        .get(`/notes/${id}`)
        .set('Cookie', cookie)
    expect(getDeletedId.status).toBe(404)

  })
})