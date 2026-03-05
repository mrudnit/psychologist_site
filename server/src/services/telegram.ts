import TelegramBot from 'node-telegram-bot-api'

let bot: TelegramBot | null = null

function getBot(): TelegramBot | null {
  if (bot) return bot

  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) {
    console.warn('[Telegram] TELEGRAM_BOT_TOKEN not set — notifications disabled')
    return null
  }

  bot = new TelegramBot(token)
  return bot
}

async function sendMessage(text: string): Promise<void> {
  const chatId = process.env.TELEGRAM_CHAT_ID
  const botInstance = getBot()

  if (!botInstance || !chatId) {
    console.warn('[Telegram] Skipping notification — bot or chat ID not configured')
    return
  }

  try {
    await botInstance.sendMessage(chatId, text, { parse_mode: 'HTML' })
    console.log('[Telegram] Notification sent')
  } catch (err) {
    console.error('[Telegram] Failed to send message:', err)
  }
}

export async function notifyNewBooking(data: {
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

  const text = [
    '🆕 <b>Нова заявка на консультацію!</b>',
    '',
    `👤 <b>Ім'я:</b> ${data.name}`,
    `🎂 <b>Вік:</b> ${data.age}`,
    `🔹 <b>Вид допомоги:</b> ${data.helpType}`,
    `📋 <b>Формат:</b> ${data.format}`,
    `⏱ <b>Коли сталася втрата:</b> ${data.lossTiming}`,
    `📞 <b>Телефон:</b> ${data.phone || 'не вказано'}`,
    `📧 <b>Email:</b> ${data.email || 'не вказано'}`,
    `💬 <b>Месенджери:</b> ${messengers}`,
    data.promoCode ? `🎟 <b>Промокод:</b> ${data.promoCode}` : null,
    data.note ? `📝 <b>Примітка:</b> ${data.note}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  await sendMessage(text)
}

export async function notifyNewContact(data: {
  name: string
  email: string
  message: string
}): Promise<void> {
  const text = [
    '✉️ <b>Нове повідомлення з форми зворотного зв\'язку!</b>',
    '',
    `👤 <b>Ім'я:</b> ${data.name}`,
    `📧 <b>Email:</b> ${data.email}`,
    `💬 <b>Повідомлення:</b>\n${data.message}`,
  ].join('\n')

  await sendMessage(text)
}
