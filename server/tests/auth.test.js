import { describe, it, expect, beforeEach } from 'vitest'
import { users } from '../src/db/schema.js'
import { signup } from '../src/services/authService.js'
import { db } from '../src/db/index.js'
import { eq } from 'drizzle-orm'

describe('sign up test', () => {
  beforeEach(async () => {
    await db.delete(users)
  })

  const examplePassword = 'blink182'

  it('creates a user and returns safe fields', async () => {
    const user = await signup('someemail@example.com', examplePassword)
    expect(user.email).toBe('someemail@example.com')
    expect(user.id).toBeDefined()
    expect(user.passwordHash).toBeUndefined()
  })

  it('hashes the stored password', async () => {
    await signup('someemail@example.com', examplePassword)
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, 'someemail@example.com'))
    const storedUser = existing[0]
    expect(storedUser.passwordHash).not.toBe(examplePassword)
  })

  it('rejects a duplicate email', async () => {
    await signup('someemail@example.com', examplePassword)
    await expect(
      signup('someemail@example.com', examplePassword),
    ).rejects.toThrow('Email already taken')
  })
})
