import { z } from 'zod'

const uuidSchema = z.object({
  id: z.string().uuid(),
})

export function validateUuidParam(req, res, next) {

  const result = uuidSchema.safeParse(req.params)
  
  if (!result.success) {
    return res.status(400).json({ error: result.error })
  }

  next()

}