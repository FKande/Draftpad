import type { Request, Response, NextFunction } from 'express'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  console.error(err)
  res.status(500).json({ error: 'Something went wrong' })
}
