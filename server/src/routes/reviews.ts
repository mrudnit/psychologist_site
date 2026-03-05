import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// GET /api/reviews
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(reviews)
  } catch (err) {
    console.error('[Reviews] DB error:', err)
    res.status(500).json({ error: 'Failed to fetch reviews' })
  }
})

export default router
