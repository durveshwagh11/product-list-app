<h1 align="center">✨ product-list-app ✨</h1>

Highlights:

- 🌟 Tech stack: PERN + TailwindCSS + Daisy UI
- 🔐 JWT auth: 15-min access token + rotating, revocable refresh token (httpOnly cookies)
- 🗄️ Supabase Postgres
- 🚀 Rate limiting (express-rate-limit)
- 👌 Global state management with Zustand
- 🐞 Error handling both on the server and client
- ⏳ And much more!

### Setup .env file

```js
PORT=3000

# Supabase -> Project Settings -> Database -> Connection string (pooler URI)
DATABASE_URL=postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres

# long random string, e.g. `openssl rand -hex 32`
JWT_SECRET=...
```

### Run the API

```shell
npm run dev
```

### Run the frontend

```shell
cd frontend
npm run dev
```

Vite proxies `/api` to `localhost:3000`, so open http://localhost:5173.

### Deploy (Render)

One Web Service serves both API and the built React app.

- Build command: `npm run build`
- Start command: `npm start`
- Env vars: `NODE_ENV=production`, `DATABASE_URL`, `JWT_SECRET`

Tables are created/migrated on boot.
