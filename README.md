# Сайт психолога — Повна документація

## Структура проєкту

```
/ (корінь — Vue 3 фронтенд)
├── src/
│   ├── components/       # Компоненти сторінок
│   ├── pages/            # Сторінки + адмін-панель
│   │   ├── AdminLogin.vue
│   │   ├── AdminDashboard.vue
│   │   ├── ArticleListPage.vue
│   │   ├── ArticlePage.vue
│   │   ├── BookPage.vue
│   │   └── HomePage.vue
│   ├── router/index.ts   # Vue Router з охороною адміна
│   └── utils/api.ts      # HTTP-клієнт
├── .env                  # VITE_API_URL
├── index.html
├── vite.config.ts
└── server/               # Node.js бекенд
    ├── src/
    │   ├── index.ts
    │   ├── routes/       # booking, contact, articles, admin
    │   ├── middleware/   # JWT auth
    │   └── services/     # Telegram + Email
    ├── prisma/
    │   └── schema.prisma
    └── .env              # всі серверні змінні
```

---

## Локальний запуск

### 1. Бекенд

```bash
cd server
npm install
cp .env.example .env     # відредагуйте пароль та токени
npx prisma db push       # ініціалізує базу даних
npm run dev              # запуск на :3001
```

### 2. Фронтенд (новий термінал)

```bash
# у корені проєкту
npm install
npm run dev              # запуск на :5173
```

Відкрийте http://localhost:5173

---

## Адмін-панель

### Вхід
Перейдіть на: **http://localhost:5173/admin**

Введіть пароль з `server/.env` → `ADMIN_PASSWORD`

### Що можна зробити в адміні

**Розділ "Заявки":**
- Переглянути всі заявки на консультацію у таблиці
- Побачити: ім'я, вік, вид допомоги, контакти, дату

**Розділ "Статті":**
- Додати нову статтю (назва, slug, текст, обкладинка)
- Відредагувати існуючу
- Видалити (потрібно натиснути двічі для підтвердження)
- Завантажити фото обкладинки

Статті автоматично з'являються на публічному сайті (/articles).

---

## Налаштування сповіщень

### Telegram
1. Напишіть [@BotFather](https://t.me/BotFather), створіть бота → отримайте `TELEGRAM_BOT_TOKEN`
2. Додайте бота до вашого каналу/чату як адміна
3. Отримайте Chat ID: відкрийте `https://api.telegram.org/bot<TOKEN>/getUpdates` після надсилання повідомлення в чат
4. Заповніть `TELEGRAM_BOT_TOKEN` та `TELEGRAM_CHAT_ID` у `server/.env`

### Email (Gmail)
1. Увімкніть двофакторну автентифікацію в Google
2. Створіть "App Password" (Пароль додатку): Google Account → Security → App passwords
3. Заповніть у `server/.env`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx  # app password
   ADMIN_EMAIL=your@gmail.com
   ```

---

## API-маршрути

### Публічні
| Метод | URL | Опис |
|-------|-----|------|
| GET | `/api/articles` | Список статей |
| GET | `/api/articles/:slug` | Стаття за slug |
| POST | `/api/booking` | Надіслати заявку |
| POST | `/api/contact` | Надіслати повідомлення |

### Адмін (потрібен JWT токен)
| Метод | URL | Опис |
|-------|-----|------|
| POST | `/api/admin/login` | Отримати токен |
| GET | `/api/admin/bookings` | Всі заявки |
| GET | `/api/admin/requests` | Те саме (псевдонім) |
| GET | `/api/admin/articles` | Всі статті |
| POST | `/api/admin/articles` | Створити статтю |
| PUT | `/api/admin/articles/:id` | Оновити статтю |
| DELETE | `/api/admin/articles/:id` | Видалити статтю |
| POST | `/api/admin/upload` | Завантажити фото |

---

## Деплой

### Варіант 1 (рекомендовано): Vercel + Render

**Фронтенд → Vercel:**
1. Завантажте проєкт на GitHub
2. Зайдіть на [vercel.com](https://vercel.com) → New Project
3. Підключіть GitHub репо
4. Root Directory: `.` (корінь)
5. Framework: Vite
6. Додайте змінну середовища: `VITE_API_URL=https://your-api.onrender.com`
7. Deploy

**Бекенд → Render:**
1. Зайдіть на [render.com](https://render.com) → New Web Service
2. Підключіть той самий GitHub репо
3. Root Directory: `server`
4. Build command: `npm install && npx prisma generate && npm run build`
5. Start command: `npm start`
6. Додайте всі змінні з `server/.env`:
   - `DATABASE_URL=file:./prisma/prod.db` (або PostgreSQL URL)
   - `PORT=3001`
   - `ADMIN_PASSWORD=ваш_надійний_пароль`
   - `JWT_SECRET=довгий_випадковий_рядок`
   - `CORS_ORIGIN=https://your-site.vercel.app`
   - `BASE_URL=https://your-api.onrender.com`
   - та Telegram/Email налаштування

> **PostgreSQL на Render:** Для продакшену краще використовувати PostgreSQL.
> Змініть `provider` у `schema.prisma` з `sqlite` на `postgresql`
> та вкажіть рядок підключення у `DATABASE_URL`.

---

### Варіант 2: VPS + Nginx

```bash
# На сервері:
git clone your-repo && cd your-repo

# Фронтенд (збирання)
npm install && npm run build
# Файли будуть у dist/

# Бекенд
cd server
npm install
npx prisma migrate deploy
npm run build
pm2 start dist/index.js --name psychologist-api
```

**Nginx конфіг:**
```nginx
server {
    listen 80;
    server_name yoursite.com;

    # Фронтенд
    root /var/www/yoursite/dist;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Бекенд API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Завантажені файли
    location /uploads/ {
        proxy_pass http://localhost:3001;
    }
}
```

```bash
# SSL (безкоштовно):
certbot --nginx -d yoursite.com
```

---

## Тестування форм

**Форма запису:**
1. Відкрийте http://localhost:5173/book
2. Заповніть форму (ім'я, вік, тип допомоги тощо)
3. Натисніть "Надіслати"
4. Перевірте адмін-панель → Заявки

**Форма зворотного зв'язку:**
1. Прокрутіть будь-яку сторінку вниз (або на головній)
2. Заповніть ім'я, email, повідомлення
3. Натисніть "Відправити"

**Перевірка через API:**
```bash
# Здоров'я сервера
curl http://localhost:3001/api/health

# Тест заявки
curl -X POST http://localhost:3001/api/booking \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Тест",
    "age": "31-45",
    "helpType": "Розрив стосунків / розлучення",
    "format": "Індивідуально",
    "lossTiming": "До 2 тижнів",
    "phone": "+380991234567"
  }'

# Вхід в адмін
curl -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password": "admin123"}'
```

---

## Змінні середовища

### server/.env
| Змінна | Обов'язкова | Опис |
|--------|-------------|------|
| `PORT` | Ні | Порт сервера (за замовчуванням 3001) |
| `DATABASE_URL` | Так | SQLite: `file:./prisma/dev.db` |
| `ADMIN_PASSWORD` | Так | Пароль для входу в адмін |
| `JWT_SECRET` | Так | Секрет для JWT токенів |
| `CORS_ORIGIN` | Так | URL фронтенду |
| `BASE_URL` | Так | URL бекенду (для посилань на фото) |
| `TELEGRAM_BOT_TOKEN` | Ні | Токен Telegram бота |
| `TELEGRAM_CHAT_ID` | Ні | ID чату Telegram |
| `SMTP_HOST` | Ні | SMTP сервер |
| `SMTP_PORT` | Ні | SMTP порт |
| `SMTP_USER` | Ні | Email відправника |
| `SMTP_PASS` | Ні | Пароль SMTP |
| `ADMIN_EMAIL` | Ні | Email для сповіщень |

### .env (фронтенд)
| Змінна | Опис |
|--------|------|
| `VITE_API_URL` | URL бекенду (за замовчуванням http://localhost:3001) |
