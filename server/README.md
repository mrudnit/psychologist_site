# Backend Server

Node.js + Express + Prisma + SQLite backend for the psychologist website.

## Setup

```bash
cd server
npm install
npx prisma db push      # creates SQLite DB and runs schema
npm run dev             # starts dev server on :3001
```

## Environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `PORT` | HTTP port | `3001` |
| `DATABASE_URL` | SQLite file path | `file:./dev.db` |
| `ADMIN_PASSWORD` | Plain-text admin password | — |
| `JWT_SECRET` | Secret key for JWT signing | — |
| `TELEGRAM_BOT_TOKEN` | Token from @BotFather | — (optional) |
| `TELEGRAM_CHAT_ID` | Chat/channel ID to send to | — (optional) |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:5173` |

## API Routes

### Public

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/booking` | Submit booking form |
| `POST` | `/api/contact` | Submit contact form |
| `GET` | `/api/articles` | List all articles |
| `GET` | `/api/articles/:slug` | Get single article |
| `GET` | `/api/reviews` | List all reviews |
| `GET` | `/api/health` | Health check |

### Admin (requires `Authorization: Bearer <token>`)

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/admin/login` | Get JWT token |
| `GET` | `/api/admin/bookings` | List all booking requests |
| `GET` | `/api/admin/contacts` | List all contact messages |
| `POST` | `/api/admin/articles` | Create article |
| `PUT` | `/api/admin/articles/:id` | Update article |
| `DELETE` | `/api/admin/articles/:id` | Delete article |
| `POST` | `/api/admin/upload` | Upload cover image (multipart) |
| `POST` | `/api/admin/reviews` | Create review |
| `DELETE` | `/api/admin/reviews/:id` | Delete review |

## Admin login example

```bash
curl -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password": "your_admin_password"}'
# → { "token": "eyJ..." }
```

## Telegram setup

1. Message [@BotFather](https://t.me/BotFather), create a bot → get `TELEGRAM_BOT_TOKEN`
2. Add the bot to your channel/group as admin
3. Get the chat ID: visit `https://api.telegram.org/bot<TOKEN>/getUpdates` after sending a message
4. Set both vars in `.env` — notifications are automatic on form submissions

## Frontend connection

Add to your frontend `.env`:

```
VITE_API_URL=http://localhost:3001
```

For production, point this to your deployed server URL.
