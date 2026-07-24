import { describe, it, expect, beforeEach } from 'vitest'
import { users, sessions } from '../src/db/schema.js'
import { signup, login } from '../src/services/authService.js'
import { db } from '../src/db/index.js'
import { eq } from 'drizzle-orm'

const exampleEmail = 'someemail@example.com'
const examplePassword = 'blink182'

describe('signup service', () => {
  beforeEach(async () => {
    await db.delete(users)
  })

  it('creates a user and returns safe fields', async () => {
    const user = await signup(exampleEmail, examplePassword)
    expect(user.email).toBe(exampleEmail)
    expect(user.id).toBeDefined()
    expect(user.passwordHash).toBeUndefined()
  })

  it('hashes the stored password', async () => {
    await signup(exampleEmail, examplePassword)
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, exampleEmail))
    const storedUser = existing[0]
    expect(storedUser.passwordHash).not.toBe(examplePassword)
  })

  it('rejects a duplicate email', async () => {
    await signup(exampleEmail, examplePassword)
    await expect(signup(exampleEmail, examplePassword)).rejects.toThrow(
      'Email already taken',
    )
  })
})

describe('login service', () => {
  beforeEach(async () => {
    await db.delete(users)
    await signup(exampleEmail, examplePassword)
  })

  it('returns a session token for valid credentials', async () => {
    const token = await login(exampleEmail, examplePassword)
    expect(token).toBeDefined()
    expect(token).toHaveLength(64)
  })

  it('creates session row', async () => {
    const token = await login(exampleEmail, examplePassword)
    const existing = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, token))
    const storedSession = existing[0]
    expect(storedSession).toBeDefined()
    expect(storedSession.expiresAt.getTime()).toBeGreaterThan(Date.now())
  })

  it('rejects wrong password', async () => {
    await expect(login(exampleEmail, 'wrong123')).rejects.toThrow(
      'Wrong email or password',
    )
  })

  it('rejects nonexistent email', async () => {
    await expect(login('wrong@email.com', examplePassword)).rejects.toThrow(
      'Wrong email or password',
    )
  })
})
