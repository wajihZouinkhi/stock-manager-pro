# 🚀 StockManager Pro — Plan de Professionnalisation

> Objectif: passer d'un MVP à un SaaS production-ready sellable/hostable.

## 🔴 Bugs corrigés (12)
1. `backend/prisma/seed.ts` L35 — `price: 29,99` → `29.99`
2. `create-category.dto.ts` — `@!sString()` → `@IsString()`
3. `categories.controller.ts` — ordre décorateurs `@Param`+`@Get`
4. `dashboard.service.ts` — Prisma `lt:{gt:0}` → `lte:5`
5. `products.service.ts` — types Query optional
6. `main.ts` — ajout Swagger + Helmet
7. `next.config.js` — rewrite `/api/:path*`
8. `tsconfig.json` — `essnext` → `esnext`
9. `postcss.config.js` — format objet
10. `tailwind.config.ts` — `sans` array correct
11. `api.ts` — template literal `${API_BASE}${url}`
12. `backend/package.json` — add swagger, helmet, jwt, passport, bcrypt, throttler, config

## 🟡 Roadmap (cycles)

### 🔐 Sécurité (P0)
- Auth JWT + RBAC (`ADMIN|MANAGER|STAFF`)
- `@nestjs/throttler` rate limit
- `.env` out of git, `.env.example`, `@nestjs/config` + Joi/Zod validation
- `bcrypt` 12 rounds
- Helmet ✅, CSP strict, CSRF
- AuditLog table

### 🗄️ Database (P0)
- SQLite → **PostgreSQL**
- Prisma Migrate (pas `db push`)
- Indexes (`sku`, `categoryId`, `isActive+quantity`)
- Soft delete (`deletedAt`)
- Multi-tenancy (`organizationId`)
- Ajouts: `User`, `Organization`, `Supplier`, `Warehouse`, `Order`, `OrderItem`, `Customer`, `Invoice`, `AuditLog`

### 🧪 Qualité (P1)
- Jest + Supertest (cible 80%)
- Vitest + RTL + Playwright
- ESLint + Prettier + Husky + lint-staged
- `strict: true`, `noUncheckedIndexedAccess`
- SonarCloud / CodeQL

### ⚡ Performance (P1)
- Pagination + `X-Total-Count`
- Redis cache (dashboard TTL 30s)
- Fix N+1 (Prisma include)
- Full-text Meilisearch ou `pg_trgm`
- Frontend: React Query, next/image, RSC streaming, Turbopack
- Cloudflare CDN + Brotli

### 🎨 UI/UX (P1)
- Pages manquantes: `/products`, `/categories`, `/suppliers`, `/orders`, `/reports`, `/settings`, `/login`, `/register`
- ShadCN: `table`(TanStack), `dialog`, `form`(RHF+zod), `select`, `dropdown-menu`, `data-table`, `command`(⌘K)
- `next-themes` dark mode
- PWA + responsive mobile-first
- `next-intl` (FR/EN/AR)
- `framer-motion` animations
- A11y WCAG 2.1 AA
- Skeletons, toasts (sonner ✅)

### 🧩 Features SaaS (P2)
- Dashboard analytics avancé (CA, marge, rotation, forecasts)
- Import/Export CSV/Excel (papaparse, exceljs)
- PDF factures (@react-pdf/renderer)
- Barcodes/QR (html5-qrcode, bwip-js)
- Email (Resend/Postmark) + push (web-push) + in-app (SSE/WS)
- Multi-entrepôts, Fournisseurs, Commandes achat
- Webhooks, API publique documentée (Swagger ✅)
- Stripe billing (Free/Pro/Enterprise)
- Onboarding wizard + react-joyride

### 🐳 DevOps (P0 pour vente)
- Dockerfile backend (multi-stage, node:20-alpine, non-root)
- Dockerfile frontend (standalone)
- docker-compose (postgres + redis + backend + frontend + nginx)
- GitHub Actions: test.yml + deploy.yml → ghcr.io
- Hosting: Railway/Render/Fly.io ou VPS + Coolify
- Monitoring: Sentry, PostHog, UptimeRobot
- Logs: Pino + Loki/Grafana ou Better Stack
- Backup: cron postgres → S3/R2
- SSL: Caddy auto-HTTPS

### 📄 Docs (P1)
- README pro (badges, screenshots, architecture)
- Swagger `/api/docs` ✅
- ADRs `docs/adr/`
- CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, CHANGELOG
- LICENSE (MIT ou commercial)
- Storybook composants UI

### 🌐 Stack moderne 2026
- NestJS 10 ✅ (ou Hono/Elysia + Drizzle pour greenfield)
- Next.js 14 → upgrade 15 (React 19 RSC)
- Tailwind 4, shadcn/ui ✅
- Zustand (client) + TanStack Query (server)
- react-hook-form + zod
- TanStack Table v8
- Auth.js v5 frontend ↔ NestJS JWT backend
- React Email + Resend
- Stripe + webhooks
- Meilisearch / Typesense
- Socket.IO / Pusher realtime

## 📅 Planning proposé
| Cycle | Durée | Livrable |
|---|---|---|
| 1 Foundation | J0 | Bugs ✅, auth JWT, User, Postgres |
| 2 Security | J+1 | RBAC, throttler, audit, env validation |
| 3 UI CRUD | J+2-3 | Pages + formulaires + toasts |
| 4 Features | J+4-5 | Suppliers, Orders, analytics poussé |
| 5 Perf+PWA | J+6 | Redis, pagination, PWA, i18n |
| 6 DevOps | J+7 | Docker, CI/CD, staging deploy |
| 7 Polish | J+8 | Storybook, README, LICENSE, landing |

## ⚠️ Actions immédiates (toi)
1. **RÉVOQUER la clé E2B leakée** `e2b_e93e283f94f492889387d72cc7df5e4e84cdd428`
2. Scrub `backend/.env` de git: `git filter-repo --path backend/.env --invert-paths`
3. Confirmer: je continue cycle 1 (auth JWT + User + Postgres) ?
