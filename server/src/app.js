import express from 'express'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.js'

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/auth', authRouter)

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

export default app
