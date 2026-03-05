import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'

import bookingRouter from './routes/booking'
import contactRouter from './routes/contact'
import articlesRouter from './routes/articles'
import adminRouter from './routes/admin'

const app = express()
const PORT = process.env.PORT || 3001
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173'

app.use(cors({ origin: corsOrigin, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded images as static files
const uploadsDir = path.join(process.cwd(), 'uploads')
app.use('/uploads', express.static(uploadsDir))

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/booking', bookingRouter)
app.use('/api/contact', contactRouter)
app.use('/api/articles', articlesRouter)
app.use('/api/admin', adminRouter)

// 404
app.use((_req, res) => res.status(404).json({ error: 'Not found' }))

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Server] Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`)
  console.log(`   CORS allowed: ${corsOrigin}`)
  console.log(`   Telegram: ${process.env.TELEGRAM_BOT_TOKEN ? '✅ configured' : '⚠️  not configured'}`)
  console.log(`   Email: ${process.env.SMTP_HOST ? '✅ configured' : '⚠️  not configured'}`)
})
