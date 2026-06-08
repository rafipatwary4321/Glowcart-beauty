# GlowCart Beauty — Deployment Guide

Deploy the Next.js app from the **`glowcart-beauty`** directory (not the repo root).

```powershell
cd "C:\Cursor\cosmetic shop\glowcart-beauty"
```

---

## Pre-deploy checklist

Run all quality gates locally:

```powershell
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

For full E2E coverage (cart, checkout, admin login), set `MONGODB_URI` and seed the database first:

```powershell
npm run seed:fresh
$env:MONGODB_URI="your-atlas-uri"
npm run test:e2e
```

See also [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) for security and ops checks.

---

## Environment variables

Copy `.env.example` to `.env.local` for local dev:

```powershell
cp .env.example .env.local
```

### Required (production)

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `NEXTAUTH_SECRET` or `AUTH_SECRET` | Random 32+ char secret for sessions |
| `NEXTAUTH_URL` or `AUTH_URL` | Public URL, e.g. `https://your-app.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | Same public URL (metadata, emails, payment callbacks) |

### Recommended

| Variable | Description |
|----------|-------------|
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Same cloud name for client URLs |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Transactional email |

### Payments

| Variable | Description |
|----------|-------------|
| `SSLCOMMERZ_STORE_ID` | SSLCommerz merchant store ID |
| `SSLCOMMERZ_STORE_PASSWORD` | SSLCommerz store password |
| `SSLCOMMERZ_IS_LIVE` | `true` in production, `false` for sandbox |
| `BKASH_*` | bKash credentials (stub integration) |
| `NAGAD_*` | Nagad credentials (stub integration) |

### Seed-only (do not use weak passwords in production)

| Variable | Description |
|----------|-------------|
| `ADMIN_EMAIL` | Admin account email for `npm run seed` |
| `ADMIN_PASSWORD` | Admin password for seeding |

---

## Vercel deployment

### 1. Connect repository

1. Push code to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New Project**.
3. Import the repository.
4. Set **Root Directory** to `glowcart-beauty` if the repo contains multiple folders.

### 2. Configure build

Vercel auto-detects Next.js. `vercel.json` in this folder sets:

- Framework: Next.js
- Build: `npm run build`
- Dev: `npm run dev -p 3000`
- Region: `sin1` (Singapore — adjust for your audience)

### 3. Add environment variables

In Vercel → Project → **Settings** → **Environment Variables**, add all required vars for **Production**, **Preview**, and **Development** as needed.

**Important:** After first deploy, set:

```
NEXTAUTH_URL=https://your-production-domain.vercel.app
AUTH_URL=https://your-production-domain.vercel.app
NEXT_PUBLIC_APP_URL=https://your-production-domain.vercel.app
```

### 4. Deploy

```powershell
# Option A: Git push (auto-deploy if connected)
git push origin main

# Option B: Vercel CLI
npm i -g vercel
cd glowcart-beauty
vercel --prod
```

### 5. Post-deploy

1. Run seed against production MongoDB (from local machine with prod `MONGODB_URI`):
   ```powershell
   $env:MONGODB_URI="mongodb+srv://..."
   $env:ADMIN_EMAIL="admin@yourdomain.com"
   $env:ADMIN_PASSWORD="strong-password-here"
   npm run seed:fresh
   ```
2. Log in at `https://your-domain/login`.
3. Open `/admin` and verify dashboard.
4. Place a test COD order.
5. Confirm `/sitemap.xml` and `/robots.txt` load.

---

## MongoDB Atlas setup

1. Create a free/paid cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. **Database Access** → create a user with read/write on your database.
3. **Network Access** → add `0.0.0.0/0` (or Vercel IP ranges) for serverless access.
4. **Connect** → copy the connection string:
   ```
   mongodb+srv://<user>:<password>@cluster.mongodb.net/glowcart?retryWrites=true&w=majority
   ```
5. Set `MONGODB_URI` in Vercel and `.env.local`.

**Connection caching:** `src/lib/db.ts` caches the Mongoose connection across serverless invocations using `global.mongooseCache` — no code changes needed for Vercel.

---

## Cloudinary setup

1. Create account at [cloudinary.com](https://cloudinary.com).
2. Dashboard → copy **Cloud name**, **API Key**, **API Secret**.
3. Set in Vercel:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud
   ```
4. Test admin upload: `/admin/products/new` → add product image.

`next.config.ts` already allows `res.cloudinary.com` for Next.js Image optimization.

---

## Payment gateway setup

### SSLCommerz

1. Register at [sslcommerz.com](https://sslcommerz.com).
2. Get sandbox credentials for testing.
3. Set env vars; keep `SSLCOMMERZ_IS_LIVE=false` until go-live.
4. Configure callback URLs in SSLCommerz dashboard:
   - Success: `https://your-domain/api/payment/sslcommerz/success`
   - Fail: `https://your-domain/api/payment/sslcommerz/fail`
   - Cancel: `https://your-domain/api/payment/sslcommerz/cancel`
5. For production, set `SSLCOMMERZ_IS_LIVE=true`.

### COD

Works without extra configuration.

---

## Admin login setup

1. Set strong `ADMIN_EMAIL` and `ADMIN_PASSWORD` in Vercel env.
2. Seed the database:
   ```powershell
   npm run seed:fresh
   ```
3. Default seed credentials (change immediately):
   - Admin: `admin@glowcart.com` / value of `ADMIN_PASSWORD`
   - Demo customer: `demo@glowcart.com` / `demo1234`
4. Log in at `/login` → navigate to `/admin`.
5. Disable or delete demo accounts in production if not needed.

---

## Playwright E2E (local / CI)

Playwright auto-starts Next.js before tests via `playwright.config.ts`:

```typescript
webServer: {
  command: "npm run dev",
  url: "http://localhost:3000",
  reuseExistingServer: true,
  timeout: 120000,
}
```

Run from **`glowcart-beauty`**:

```powershell
cd glowcart-beauty
npx playwright install chromium
npm run test:e2e
npm run test:e2e:ui
```

If port 3000 is busy, stop other dev servers or run:

```powershell
npm run dev
# In another terminal:
npm run test:e2e
```

With `reuseExistingServer: true`, Playwright reuses an already-running dev server.

---

## Production safety notes

- **No hardcoded secrets** — all credentials come from env vars via `src/config/env.ts`.
- **`.env.local` is gitignored** — only `.env.example` is committed (template).
- **All API routes** use `export const runtime = "nodejs"` for MongoDB/Auth compatibility.
- **Middleware** uses edge-safe `@/auth.config` (no Mongoose in Edge).
- **Admin routes** protected by middleware + role checks on API routes.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `MONGODB_URI is not set` | Add env var in Vercel / `.env.local` |
| Auth redirect loop | Ensure `NEXTAUTH_URL` matches deployed domain |
| Playwright connection refused | Run from `glowcart-beauty`; ensure port 3000 free |
| Image upload fails | Verify Cloudinary env vars |
| SSLCommerz redirect fails | Check `NEXT_PUBLIC_APP_URL` and callback URLs |
| Build fails on Vercel | Confirm root directory is `glowcart-beauty` |

---

## Useful commands

```powershell
cd glowcart-beauty

npm run dev          # http://localhost:3000
npm run build
npm run start
npm run lint
npm run seed:fresh
npm run test:e2e
```
