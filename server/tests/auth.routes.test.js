import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'
import { db } from '../src/db/index.js'
import { users } from '../src/db/schema.js'
import { signup } from '../src/services/authService.js'

describe('GET /auth/me', () => {
  beforeEach(async () => {
    await db.delete(users)
  })

  it('returns 401 without a session cookie', async () => {
    const res = await request(app).get('/auth/me')
    expect(res.status).toBe(401)
  })

  it('returns the user with a valid session cookie', async () => {
    await signup('me@example.com', 'password123')

    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: 'me@example.com', password: 'password123' })

    const cookie = loginRes.headers['set-cookie']

    const meRes = await request(app).get('/auth/me').set('Cookie', cookie)

    expect(meRes.status).toBe(200)
    expect(meRes.body.email).toBe('me@example.com')
  })
})
