import express from 'express'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.js'
import notesRouter from './routes/notes.js'
import { errorHandler } from './middleware/errorHandler.js'
import cors from 'cors'

const app = express()

app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
}))

app.use(express.json())
app.use(cookieParser())

app.use('/auth', authRouter)
app.use('/notes', notesRouter)

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use(errorHandler)

export default app
