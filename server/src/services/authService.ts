import { db } from '../db/index.js'
import { users, sessions } from '../db/schema.js'
import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import crypto from 'crypto'

async function createSession(userId: string) {
  const generatedToken = crypto.randomBytes(32).toString('hex')
  const tokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  await db
    .insert(sessions)
    .values({ id: generatedToken, userId: userId, expiresAt: tokenExpiry })

  return generatedToken
}

export async function signup(email: string, password: string) {
  const existing = await db.select().from(users).where(eq(users.email, email))

  if (existing.length > 0) {
    throw new Error('Email already taken')
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const [newUser] = await db
    .insert(users)
    .values({ email, passwordHash })
    .returning({ id: users.id, email: users.email, createdAt: users.createdAt })

  const token = await createSession(newUser.id)

  return { token, user: newUser }
}

export async function login(email: string, password: string) {
  const errorMessage = 'Wrong email or password'

  const existing = await db.select().from(users).where(eq(users.email, email))
  const dbUser = existing[0]

  if (!dbUser) {
    throw new Error(errorMessage)
  }

  const isPasswordEqualToHash = await bcrypt.compare(
    password,
    dbUser.passwordHash,
  )

  if (!isPasswordEqualToHash) {
    throw new Error(errorMessage)
  }

  const token = await createSession(dbUser.id)
  const user = { id: dbUser.id, email: dbUser.email, createdAt: dbUser.createdAt }

  return { token, user }
}

export async function logout(token: string) {
  await db.delete(sessions).where(eq(sessions.id, token))
}
