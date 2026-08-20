import { z } from 'zod'
import type { Request, Response, NextFunction } from 'express'


const uuidSchema = z.object({
  id: z.string().uuid(),
})

export function validateUuidParam(req: Request, res: Response, next: NextFunction) {

  const result = uuidSchema.safeParse(req.params)

  if (!result.success) {
    return res.status(400).json({ error: result.error })
  }

  next()

}
