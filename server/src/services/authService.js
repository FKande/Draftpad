import { db } from '../db/index.js'
import { users } from '../db/schema.js'
import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'

export async function signup(email, password) {
  const existing = await db.select().from(users).where(eq(users.email, email))

  if (existing.length > 0) {
    throw new Error('Email already taken')
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const [newUser] = await db
    .insert(users)
    .values({ email, passwordHash })
    .returning({ id: users.id, email: users.email, createdAt: users.createdAt })

  return newUser
}
