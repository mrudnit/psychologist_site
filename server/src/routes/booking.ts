import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { notifyNewBooking } from '../services/telegram'
import { emailNewBooking } from '../services/email'

const router = Router()
const prisma = new PrismaClient()

const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.enum(['18-30', '31-45', '46-60', '61+']),
  helpType: z.enum([
    'Підтримка при втраті тварини',
    'Підтримка для тих, кому нема куди повертатися',
    'Розрив стосунків / розлучення',
    'Домашнє насильство',
    'Інші "невидимі" втрати',
  ]),
  format: z.enum(['Індивідуально', 'Група', 'Не знаю, підкажіть']),
  lossTiming: z.enum([
    'До 2 тижнів',
    'Від 2 тижнів до 2 місяців тому',
    'Від 2 до 4 місяців тому',
    '4 місяці тому і більше',
  ]),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal('')),
  messengers: z.array(z.enum(['Telegram', 'Viber', 'WhatsApp'])).default([]),
  promoCode: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
})

// POST /api/booking
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const result = bookingSchema.safeParse(req.body)
  if (!result.success) {
    res.status(422).json({ error: 'Validation failed', details: result.error.flatten() })
    return
  }
  const data = result.data
  const hasPhone = data.phone && data.phone.trim().length >= 8
  const hasEmail = data.email && data.email.trim().includes('@')
  if (!hasPhone && !hasEmail) {
    res.status(422).json({ error: 'Either phone or email is required' })
    return
  }
  try {
    const booking = await prisma.bookingRequest.create({
      data: {
        name: data.name,
        age: data.age,
        helpType: data.helpType,
        format: data.format,
        lossTiming: data.lossTiming,
        phone: data.phone || null,
        email: data.email || null,
        messengers: JSON.stringify(data.messengers),
        promoCode: data.promoCode || null,
        note: data.note || null,
      },
    })
    const notifyData = {
      name: data.name, age: data.age, helpType: data.helpType,
      format: data.format, lossTiming: data.lossTiming,
      phone: data.phone, email: data.email,
      messengers: JSON.stringify(data.messengers),
      promoCode: data.promoCode, note: data.note,
    }
    notifyNewBooking(notifyData).catch(console.error)
    emailNewBooking(notifyData).catch(console.error)
    res.status(201).json({ success: true, id: booking.id })
  } catch (err) {
    console.error('[Booking] DB error:', err)
    res.status(500).json({ error: 'Failed to save booking request' })
  }
})

export default router
