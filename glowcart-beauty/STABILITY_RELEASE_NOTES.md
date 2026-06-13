# GlowCart Beauty — Stability Release v0.9.0

Release date: 2026-06-13  
Mode: Stability / no new features

## Summary

This release focuses on production build reliability, banner API stability, homepage runtime safety, and admin-to-storefront data wiring. All changes are bug fixes and hardening — no new product features.

## What Was Fixed

### Banner API (`GET /api/banners`, `GET /api/banners?admin=true`)

- Added dedicated `banner-serializer` with safe ObjectId → string conversion
- Switched banner queries to `.lean()` with explicit field mapping
- Returns empty array `[]` when no banners exist (no crash)
- Returns `{ success: false, error: "Failed to load banners" }` on handler failures
- Fixed `DbConnectionError` status mapping (503 when MongoDB unavailable, not 500)
- Removed conflicting `src/lib/db/index.ts` stub that interfered with module resolution
- Hardened generic `serializeDocument()` for plain/lean Mongoose objects

### Homepage Runtime & Layout

- Added `safe-section-data` helpers — `asArray()`, `filterRenderable()`, stable keys
- Guarded all homepage sections against undefined data before `.map()`
- Added `HomeSectionBoundary` error boundaries with dev logging
- Added Suspense loading skeletons for hero and promo sections
- Static fallbacks (`heroContent`, `featuredPromotion`) when DB/API fails
- Simplified hero to single-column layout — removed overlapping editor-pick card and excessive whitespace
- Added `scroll-mt-28` so sticky header does not overlap hero anchors

### Admin → Storefront Data

- Catalog service loads products, categories, brands, banners from MongoDB
- Static seed data used only when DB is empty (not on connection failure)
- Admin dashboard banner list guards non-array API responses
- Hero mapper uses DB `subtitle` field for accent line (not word-split title)

### Build & TypeScript

- Production build passes: `npm run build` (89 routes, 0 TypeScript errors)
- All API routes use `export const runtime = "nodejs"` where required

## Verification Commands

```powershell
cd glowcart-beauty

# Start local MongoDB (required for live DB data)
npx tsx scripts/dev-mongo.ts

# Dev server (restart after mongo starts)
npm run dev

# Optional seed
npm run seed

# Production build
npm run build

# Verify endpoints
Invoke-RestMethod http://localhost:3000/api/banners
Invoke-RestMethod "http://localhost:3000/api/banners?admin=true"
```

## Known Issues

| Issue | Impact | Workaround |
|-------|--------|------------|
| MongoDB must be running locally | Banner/product APIs return 503 without DB | Run `npx tsx scripts/dev-mongo.ts` |
| Embedded MongoDB process may exit | Dev DB connection lost after ~2 min | Restart dev-mongo script |
| Slow page loads with MongoDB cold start | 10–20s first load in dev | Restart dev server after mongo starts |
| `middleware` deprecation warning | Build warning only | Migrate to `proxy` convention (Next.js 16) |
| Admin dev hydration warnings | Console noise on admin pages | Does not affect production build |
| E2E tests require seeded DB + auth env | 6 tests skipped without setup | Run `npm run seed` before E2E |

## Next Priorities (Post v0.9.0)

1. **Production MongoDB** — Configure Atlas URI and IP allowlist for deployment
2. **Middleware → proxy migration** — Resolve Next.js 16 deprecation warning
3. **Admin auth hardening** — Protect banner/product write APIs with session checks
4. **Performance** — Add connection pooling tuning and catalog query caching
5. **E2E CI** — Wire MongoDB + seed into GitHub Actions for full test coverage
6. **Payment QA** — End-to-end SSLCommerz/bKash/Nagad flow in staging

## Changed Files (Stability Commits)

```
src/lib/api/banner-serializer.ts
src/lib/api/errors.ts
src/lib/api/serialize.ts
src/app/api/banners/route.ts
src/app/api/banners/[id]/route.ts
src/lib/catalog/service.ts
src/lib/catalog/mappers.ts
src/lib/catalog/db-state.ts
src/lib/admin/mappers.ts
src/lib/admin/services.ts
src/components/admin/admin-banners-section.tsx
src/components/home/hero-banner.tsx
src/components/home/hero-banner-skeleton.tsx
src/components/home/homepage-sections.tsx
src/components/home/home-section-boundary.tsx
src/components/home/safe-section-data.ts
src/components/home/categories-section.tsx
src/components/home/top-brands-section.tsx
src/components/home/trending-products-section.tsx
src/components/home/skin-concerns-section.tsx
src/components/home/promotional-banner-section.tsx
src/lib/db/index.ts (deleted)
```

## Git Commit Message

```
chore: release v0.9.0 stability notes and version bump

Document banner API, homepage, and build fixes. Production build verified.
```
