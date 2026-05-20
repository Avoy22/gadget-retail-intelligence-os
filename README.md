# Gadget Retail Intelligence OS

A portfolio-ready frontend MVP for an electronics retail intelligence platform.
Built with **React 19 + TypeScript + Vite + Tailwind v4 + Recharts**, fully
frontend-only with local mock data — no backend, no auth, no database.

## What it shows

- **Public storefront** — hero landing, product catalog with search / category /
  sort filters, product detail pages with store-wise availability, interactive
  product comparison, and a customer-facing repair request form.
- **Admin OS** — operations dashboard with revenue, inventory exception list,
  reservations queue, repair queue, competitor pricing intelligence, and
  product management table.
- **Analytics** — Recharts visuals for revenue trend, category revenue, units /
  margin curves, and growth leaders, all derived from the same mock dataset.

## Tech notes

- Routing via `react-router-dom` with separate `PublicLayout` and `AdminLayout`
  shells under `/` and `/admin`.
- All numbers in stat cards, charts, and tables are derived from a single
  `src/data/mockData.ts` — no duplicated magic constants.
- Shared primitives live in `src/components/common` (`Badge`, `DataTable`,
  `PageHeader`, `StatCard`, `EmptyState`).
- Typed end to end via `src/types/index.ts`.

## Scripts

```bash
npm run dev      # start the Vite dev server
npm run build    # type-check + production build
npm run preview  # preview the production build
npm run lint     # run ESLint
```

## Project structure

```
src/
  components/
    analytics/   # Recharts wrappers
    common/      # Badge, DataTable, PageHeader, StatCard, EmptyState
    layout/      # PublicLayout, AdminLayout
    products/    # ProductCard, AvailabilityTable
  data/          # mockData.ts + lookups.ts
  pages/         # route components (public + admin + 404)
  routes/        # AppRoutes
  types/         # shared TypeScript types
  utils/         # format helpers + cx
```

## Deployment

The app is a standard Vite static build — `npm run build` produces a `dist/`
folder that can be deployed to Vercel, Netlify, Cloudflare Pages, or any
static host with SPA fallback to `index.html`.
