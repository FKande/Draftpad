import { db } from '../db/index.js'
import { users, sessions } from '../db/schema.js'
import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import crypto from 'crypto'

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

export async function login(email, password) {
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

  const generatedToken = crypto.randomBytes(32).toString('hex')

  const tokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  await db
    .insert(sessions)
    .values({ id: generatedToken, userId: dbUser.id, expiresAt: tokenExpiry })

  return generatedToken
}
