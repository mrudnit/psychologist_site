import { Router, Request, Response } from 'express'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { PrismaClient } from '@prisma/client'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// ─── Multer setup ─────────────────────────────────────────────────────────────
const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '-')
    cb(null, `${base}-${Date.now()}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!/\.(jpe?g|png|webp|gif)$/i.test(file.originalname)) {
      return cb(new Error('Only image files are allowed'))
    }
    cb(null, true)
  },
})

// ─── Schemas ──────────────────────────────────────────────────────────────────
const loginSchema = z.object({ password: z.string().min(1) })

const articleSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  coverUrl: z.string().optional().nullable(),
})

// ─── POST /api/admin/login ────────────────────────────────────────────────────
router.post('/login', (req: Request, res: Response): void => {
  const result = loginSchema.safeParse(req.body)
  if (!result.success) { res.status(400).json({ error: 'Password is required' }); return }

  const adminPassword = process.env.ADMIN_PASSWORD
  const jwtSecret = process.env.JWT_SECRET
  if (!adminPassword || !jwtSecret) { res.status(500).json({ error: 'Server auth not configured' }); return }
  if (result.data.password !== adminPassword) { res.status(401).json({ error: 'Invalid password' }); return }

  const token = jwt.sign({ role: 'admin' }, jwtSecret, { expiresIn: '7d' })
  res.json({ token })
})

// ─── All routes below require auth ───────────────────────────────────────────
router.use(requireAuth)

// ─── GET /api/admin/bookings (also aliased as /requests) ─────────────────────
const getBookings = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookings = await prisma.bookingRequest.findMany({ orderBy: { createdAt: 'desc' } })
    const parsed = bookings.map((b) => ({
      ...b,
      messengers: (() => { try { return JSON.parse(b.messengers) } catch { return [] } })(),
    }))
    res.json(parsed)
  } catch (err) {
    console.error('[Admin] DB error:', err)
    res.status(500).json({ error: 'Failed to fetch bookings' })
  }
}
router.get('/bookings', getBookings)
router.get('/requests', getBookings) // alias per spec

// ─── GET /api/admin/contacts ──────────────────────────────────────────────────
router.get('/contacts', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(messages)
  } catch (err) {
    console.error('[Admin] DB error:', err)
    res.status(500).json({ error: 'Failed to fetch contacts' })
  }
})

// ─── GET /api/admin/articles ──────────────────────────────────────────────────
router.get('/articles', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const articles = await prisma.article.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(articles)
  } catch (err) {
    console.error('[Admin] DB error:', err)
    res.status(500).json({ error: 'Failed to fetch articles' })
  }
})

// ─── POST /api/admin/articles ─────────────────────────────────────────────────
router.post('/articles', async (req: AuthRequest, res: Response): Promise<void> => {
  const result = articleSchema.safeParse(req.body)
  if (!result.success) {
    res.status(422).json({ error: 'Validation failed', details: result.error.flatten() })
    return
  }
  try {
    const article = await prisma.article.create({ data: result.data })
    res.status(201).json(article)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes('Unique constraint')) { res.status(409).json({ error: 'Slug already exists' }); return }
    console.error('[Admin] DB error:', err)
    res.status(500).json({ error: 'Failed to create article' })
  }
})

// ─── PUT /api/admin/articles/:id ─────────────────────────────────────────────
router.put('/articles/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10)
  if (isNaN(id)) { res.status(400).json({ error: 'Invalid article ID' }); return }

  const result = articleSchema.partial().safeParse(req.body)
  if (!result.success) {
    res.status(422).json({ error: 'Validation failed', details: result.error.flatten() })
    return
  }
  try {
    const article = await prisma.article.update({ where: { id }, data: result.data })
    res.json(article)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes('Record to update not found')) { res.status(404).json({ error: 'Article not found' }); return }
    console.error('[Admin] DB error:', err)
    res.status(500).json({ error: 'Failed to update article' })
  }
})

// ─── DELETE /api/admin/articles/:id ──────────────────────────────────────────
router.delete('/articles/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10)
  if (isNaN(id)) { res.status(400).json({ error: 'Invalid article ID' }); return }
  try {
    await prisma.article.delete({ where: { id } })
    res.json({ success: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes('Record to delete does not exist')) { res.status(404).json({ error: 'Article not found' }); return }
    console.error('[Admin] DB error:', err)
    res.status(500).json({ error: 'Failed to delete article' })
  }
})

// ─── POST /api/admin/upload ───────────────────────────────────────────────────
router.post('/upload', upload.single('image'), (req: AuthRequest, res: Response): void => {
  if (!req.file) { res.status(400).json({ error: 'No file uploaded' }); return }
  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3001}`
  const url = `${baseUrl}/uploads/${req.file.filename}`
  res.json({ url })
})

export default router
