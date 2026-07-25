import { db } from '../db/index.js'
import { users, sessions } from '../db/schema.js'
import { eq } from 'drizzle-orm'

const errorMessage = 'Unauthorized'

export async function requireAuth(req, res, next) {
  const token = req.cookies.session

  if (!token) {
    return res.status(401).json({ error: errorMessage })
  }

  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, token))

  if (!session) {
    return res.status(401).json({ error: errorMessage })
  }

  if (session.expiresAt.getTime() < Date.now()) {
    return res.status(401).json({ error: errorMessage })
  }

  const [targetUser] = await db
    .select({ id: users.id, email: users.email, createdAt: users.createdAt })
    .from(users)
    .where(eq(users.id, session.userId))

  req.user = targetUser

  next()
}
