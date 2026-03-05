import nodemailer from 'nodemailer'

function getTransporter() {
  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT || '587', 10)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    return null
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

async function sendEmail(subject: string, html: string): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL
  const transporter = getTransporter()

  if (!transporter || !adminEmail) {
    console.warn('[Email] SMTP not configured — skipping email notification')
    return
  }

  try {
    await transporter.sendMail({
      from: `"Сайт психолога" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject,
      html,
    })
    console.log('[Email] Notification sent to', adminEmail)
  } catch (err) {
    console.error('[Email] Failed to send:', err)
  }
}

export async function emailNewBooking(data: {
  name: string
  age: string
  helpType: string
  format: string
  lossTiming: string
  phone?: string | null
  email?: string | null
  messengers: string
  promoCode?: string | null
  note?: string | null
}): Promise<void> {
  const messengers = (() => {
    try {
      const parsed = JSON.parse(data.messengers)
      return Array.isArray(parsed) && parsed.length > 0 ? parsed.join(', ') : 'не вказано'
    } catch {
      return 'не вказано'
    }
  })()

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
      <h2 style="color: #2A2A2A; margin-bottom: 24px;">🆕 Нова заявка на консультацію</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #6b7280; width: 40%;">Ім'я</td><td style="padding: 8px 0; font-weight: 600;">${data.name}</td></tr>
        <tr><td style="padding: 8px 0; color: #6b7280;">Вік</td><td style="padding: 8px 0; font-weight: 600;">${data.age}</td></tr>
        <tr><td style="padding: 8px 0; color: #6b7280;">Вид допомоги</td><td style="padding: 8px 0; font-weight: 600;">${data.helpType}</td></tr>
        <tr><td style="padding: 8px 0; color: #6b7280;">Формат</td><td style="padding: 8px 0; font-weight: 600;">${data.format}</td></tr>
        <tr><td style="padding: 8px 0; color: #6b7280;">Час втрати</td><td style="padding: 8px 0; font-weight: 600;">${data.lossTiming}</td></tr>
        <tr><td style="padding: 8px 0; color: #6b7280;">Телефон</td><td style="padding: 8px 0; font-weight: 600;">${data.phone || 'не вказано'}</td></tr>
        <tr><td style="padding: 8px 0; color: #6b7280;">Email</td><td style="padding: 8px 0; font-weight: 600;">${data.email || 'не вказано'}</td></tr>
        <tr><td style="padding: 8px 0; color: #6b7280;">Месенджери</td><td style="padding: 8px 0; font-weight: 600;">${messengers}</td></tr>
        ${data.promoCode ? `<tr><td style="padding: 8px 0; color: #6b7280;">Промокод</td><td style="padding: 8px 0; font-weight: 600;">${data.promoCode}</td></tr>` : ''}
        ${data.note ? `<tr><td style="padding: 8px 0; color: #6b7280;">Примітка</td><td style="padding: 8px 0; font-weight: 600;">${data.note}</td></tr>` : ''}
      </table>
      <p style="margin-top: 24px; color: #6b7280; font-size: 12px;">Повідомлення надійшло з форми запису на сайті.</p>
    </div>
  `
  await sendEmail('Нова заявка на консультацію', html)
}

export async function emailNewContact(data: {
  name: string
  email: string
  message: string
}): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
      <h2 style="color: #2A2A2A; margin-bottom: 24px;">✉️ Нове повідомлення з форми зворотного зв'язку</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #6b7280; width: 40%;">Ім'я</td><td style="padding: 8px 0; font-weight: 600;">${data.name}</td></tr>
        <tr><td style="padding: 8px 0; color: #6b7280;">Email</td><td style="padding: 8px 0; font-weight: 600;">${data.email}</td></tr>
      </table>
      <div style="margin-top: 16px; padding: 16px; background: #f9fafb; border-radius: 8px;">
        <p style="margin: 0; color: #6b7280; font-size: 12px; margin-bottom: 8px;">Повідомлення:</p>
        <p style="margin: 0; color: #2A2A2A;">${data.message.replace(/\n/g, '<br>')}</p>
      </div>
      <p style="margin-top: 24px; color: #6b7280; font-size: 12px;">Повідомлення надійшло з форми зворотного зв'язку на сайті.</p>
    </div>
  `
  await sendEmail(`Нове повідомлення від ${data.name}`, html)
}
