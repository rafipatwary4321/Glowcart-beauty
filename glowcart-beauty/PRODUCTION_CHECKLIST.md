# GlowCart Beauty — Production Checklist

Use this checklist before deploying to production.

## 1. Environment variables

Copy `.env.example` values into your hosting provider. Required for a full production deployment:

| Variable | Required | Purpose |
|----------|----------|---------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `NEXTAUTH_SECRET` / `AUTH_SECRET` | Yes | Session signing secret (32+ chars) |
| `NEXTAUTH_URL` / `AUTH_URL` | Yes | Public app URL, e.g. `https://your-domain.com` |
| `NEXT_PUBLIC_APP_URL` | Yes | Same public URL for metadata and links |
| `CLOUDINARY_CLOUD_NAME` | Recommended | Image uploads |
| `CLOUDINARY_API_KEY` | Recommended | Image uploads |
| `CLOUDINARY_API_SECRET` | Recommended | Image uploads |
| `SSLCOMMERZ_STORE_ID` | For online pay | SSLCommerz gateway |
| `SSLCOMMERZ_STORE_PASSWORD` | For online pay | SSLCommerz gateway |
| `SSLCOMMERZ_IS_LIVE` | For online pay | Set `true` in production |
| `SMTP_HOST` | Recommended | Transactional email |
| `SMTP_PORT` | Recommended | Usually `587` |
| `SMTP_USER` | Recommended | SMTP username |
| `SMTP_PASS` | Recommended | SMTP password |
| `SMTP_FROM` | Recommended | From address |
| `ADMIN_EMAIL` / `ADMIN_SEED_EMAIL` | Seed only | Admin account email for seeding |
| `ADMIN_PASSWORD` / `ADMIN_SEED_PASSWORD` | Seed only | Admin password for seeding |

Optional payment stubs: `BKASH_*`, `NAGAD_*`

E2E testing (optional):

| Variable | Purpose |
|----------|---------|
| `E2E_ADMIN_EMAIL` | Playwright admin login |
| `E2E_ADMIN_PASSWORD` | Playwright admin login |
| `E2E_CUSTOMER_EMAIL` | Playwright customer login |
| `E2E_CUSTOMER_PASSWORD` | Playwright customer login |
| `PLAYWRIGHT_BASE_URL` | Override test base URL |

## 2. MongoDB setup

1. Create a MongoDB Atlas cluster (or self-hosted instance).
2. Allow your deployment IP (or `0.0.0.0/0` during setup, then restrict).
3. Create a database user with read/write access.
4. Set `MONGODB_URI` in production env.
5. Seed initial data:

```bash
npm run seed:fresh
```

This creates:
- Admin user (from `ADMIN_EMAIL` / `ADMIN_PASSWORD`, defaults: `admin@glowcart.com` / `admin1234`)
- Demo customer (`demo@glowcart.com` / `demo1234`)
- Sample catalog, orders, coupons, and settings

**Change default passwords immediately after first deploy.**

## 3. Cloudinary setup

1. Create a Cloudinary account.
2. Copy Cloud name, API Key, and API Secret into env.
3. Verify admin image upload (products, banners, blogs, settings).
4. Confirm `res.cloudinary.com` is allowed in `next.config.ts` (already configured).

## 4. Payment setup

### Cash on Delivery (COD)
Works without extra configuration.

### SSLCommerz
1. Register a merchant account.
2. Set `SSLCOMMERZ_STORE_ID` and `SSLCOMMERZ_STORE_PASSWORD`.
3. Set `SSLCOMMERZ_IS_LIVE=true` in production.
4. Configure success/fail/cancel URLs to your domain:
   - `/api/payment/sslcommerz/success`
   - `/api/payment/sslcommerz/fail`
   - `/api/payment/sslcommerz/cancel`

### bKash / Nagad
Stub integrations exist. Configure credentials before enabling in checkout.

## 5. Admin account

After seeding:
- **Admin:** `admin@glowcart.com` / `admin1234` (or your `ADMIN_*` env values)
- **Demo customer:** `demo@glowcart.com` / `demo1234`

Post-deploy:
1. Log in at `/login`.
2. Open `/admin`.
3. Change admin password via profile or database.
4. Remove or disable demo accounts if not needed.

## 6. Deployment steps

### Pre-deploy verification

```bash
npm run lint
npm run build
npm run test:e2e
```

### Build & start

```bash
npm ci
npm run build
npm run start
```

### Recommended hosts
- Vercel (Next.js native)
- Railway / Render / Fly.io (Node server)

### Post-deploy smoke test
- [ ] Homepage loads
- [ ] Products and product detail pages load
- [ ] Login / register work
- [ ] Cart, wishlist, checkout (authenticated)
- [ ] Admin dashboard and products CRUD
- [ ] Blog and marketing pages load
- [ ] `/sitemap.xml` and `/robots.txt` accessible
- [ ] Place test COD order end-to-end
- [ ] Email notifications (if SMTP configured)

## 7. Security checklist

- [ ] Strong `NEXTAUTH_SECRET` / `AUTH_SECRET` (never commit secrets)
- [ ] MongoDB user has least-privilege access
- [ ] MongoDB IP allowlist configured
- [ ] HTTPS enforced on production domain
- [ ] Default admin/demo passwords changed
- [ ] `.env*` files not committed (see `.gitignore`)
- [ ] Admin routes protected by middleware + role checks
- [ ] API routes use `runtime = "nodejs"` where DB/auth is required
- [ ] Cloudinary upload restricted to admin-authenticated `/api/upload`
- [ ] Payment webhooks/callbacks validate gateway responses
- [ ] SMTP credentials stored as secrets, not in repo
- [ ] Review `robots.txt` disallow rules for admin/API paths

## 8. Quality & monitoring

- Run Playwright smoke tests in CI with `MONGODB_URI` for full coverage.
- Monitor server logs for API 5xx errors.
- Watch MongoDB connection errors and slow queries.
- Set up uptime checks for `/` and `/api/products`.

## 9. Useful commands

```bash
# Development
npm run dev

# Production build
npm run build
npm run start

# Database seed
npm run seed:fresh

# Lint
npm run lint

# E2E tests
npx playwright install
npm run test:e2e
npm run test:e2e:ui
```
