import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// GET /api/articles
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverUrl: true,
        createdAt: true,
      },
    })
    res.json(articles)
  } catch (err) {
    console.error('[Articles] DB error:', err)
    res.status(500).json({ error: 'Failed to fetch articles' })
  }
})

// GET /api/articles/:slug
router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const article = await prisma.article.findUnique({
      where: { slug: req.params.slug },
    })

    if (!article) {
      res.status(404).json({ error: 'Article not found' })
      return
    }

    res.json(article)
  } catch (err) {
    console.error('[Articles] DB error:', err)
    res.status(500).json({ error: 'Failed to fetch article' })
  }
})

export default router
