import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { notifyNewContact } from '../services/telegram'
import { emailNewContact } from '../services/email'

const router = Router()
const prisma = new PrismaClient()

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(5, 'Message must be at least 5 characters'),
})

// POST /api/contact
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const result = contactSchema.safeParse(req.body)
  if (!result.success) {
    res.status(422).json({ error: 'Validation failed', details: result.error.flatten() })
    return
  }
  const data = result.data
  try {
    const message = await prisma.contactMessage.create({
      data: { name: data.name, email: data.email, message: data.message },
    })
    notifyNewContact(data).catch(console.error)
    emailNewContact(data).catch(console.error)
    res.status(201).json({ success: true, id: message.id })
  } catch (err) {
    console.error('[Contact] DB error:', err)
    res.status(500).json({ error: 'Failed to save contact message' })
  }
})

export default router
