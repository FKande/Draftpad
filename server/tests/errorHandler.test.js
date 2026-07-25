import { describe, it, expect } from 'vitest'
import request from 'supertest'
import express from 'express'
import { errorHandler } from '../src/middleware/errorHandler.js'

describe('errorHandler', () => {
  it('returns a generic 500 without leaking the error', async () => {
    const app = express()

    app.get('/throw', () => {
      throw new Error('secret internal detail')
    })

    app.use(errorHandler)

    const res = await request(app).get('/throw')
    expect(res.status).toBe(500)
    expect(res.body.error).toBe('Something went wrong')
    expect(JSON.stringify(res.body)).not.toContain('secret internal detail')
  })
})
