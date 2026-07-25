import { db } from '../db/index.js'
import { users, sessions } from '../db/schema.js'
import { eq } from 'drizzle-orm'

const errorMessage = 'Unauthorized'

export async function requireAuth(req, res, next) {
  // 1. read the session token from the cookie
  const token = req.cookies.session

  // 2. if there's no token, 401
  if (!token) {
    return res.status(401).json({ error: errorMessage })
  }

  // 3. look up the session in the database
  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, token))

  // 4. if no session found, 401
  if (!session) {
    return res.status(401).json({ error: errorMessage })
  }

  // 5. if the session has expired, 401
  if (session.expiresAt.getTime() < Date.now()) {
    return res.status(401).json({ error: errorMessage })
  }

  // 6. look up the user that session belongs to
  const [targetUser] = await db
    .select({ id: users.id, email: users.email, createdAt: users.createdAt })
    .from(users)
    .where(eq(users.id, session.userId))

  // 7. attach the user to req
  req.user = targetUser

  // 8. call next()
  next()
}
