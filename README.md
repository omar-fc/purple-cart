# PurpleCart — Demo E-Commerce

A responsive, accessible, fully localized (EN/AR + RTL) demo storefront with a
dynamic theme system and a protected admin portal.

**Stack:** React + Vite + TypeScript · Zustand · Zod · Tailwind (class dark mode)
· React Router · react-i18next.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

**Admin login:** `admin` / `admin` (visit the account icon → `/admin/login`).

## Architecture

Strict **presentation / container** separation:

```
src/
├── schemas/      Zod schemas — single source of truth for every data model.
│                 TS types are inferred from them (no drift).
├── api/          Mock API layer. Promise-based (simulated latency),
│                 localStorage-persisted. Every read & write is Zod-validated.
│                 storage.ts (primitives) · seed.ts · bootstrap.ts ·
│                 categories.ts · products.ts
├── store/        Zustand stores: cart · theme · locale · auth (all persisted).
├── i18n/         react-i18next config + en/ar resources. Owns the <html> dir
│                 (RTL) + lang side-effect (applyDocumentDirection).
├── hooks/        Container logic: useAsync, useCatalog, usePagination,
│                 useLocale (t + currency), useProductCustomization (the
│                 pricing/selection engine).
├── components/   PURELY PRESENTATIONAL (props in, UI out). ProductCard,
│                 Pagination, Navbar, CategoryNav, StockBadge, ui/*, product/*,
│                 admin/ProductForm. Exceptions: ThemeToggle/LanguageToggle are
│                 "connected widgets" bound to a single global UI preference.
├── layouts/      PublicLayout (nav+footer) · AdminLayout (sidebar).
└── pages/        Containers: fetch data via hooks, run Zustand mutations, feed
                  presentational components. Home · PLP · PDP · Cart · admin/*.
```

### Key rules enforced

- **Zod boundaries** — nothing untyped reaches the UI or storage. `readCollection`
  / `writeCollection` validate on *both* sides; create/update services validate
  payloads before persisting.
- **i18n + RTL** — no hardcoded copy; all strings are translation keys. Switching
  to Arabic flips `document.dir` to `rtl`. Layouts use **logical** Tailwind
  utilities (`ms-*`, `pe-*`, `start-*`, `end-*`, `border-e`) so they mirror with
  zero extra CSS.
- **Theme** — class-based dark mode; preference persisted in Zustand and applied
  to `<html>` before first paint (no flash).
- **Currency** — locale-aware via `Intl.NumberFormat`: EN → USD, AR → EGP.

## Feature map

| Feature | Location |
| --- | --- |
| Global nav, search, cart badge, account, toggles | `components/Navbar.tsx` |
| Category dropdowns | `components/CategoryNav.tsx` |
| Home (hero, categories, top-3 featured) | `pages/HomePage.tsx` |
| PLP (URL filters + 9/page pagination) | `pages/ProductListingPage.tsx` |
| PDP (gallery, **customization engine**, live price, tabs) | `pages/ProductDetailPage.tsx` + `hooks/useProductCustomization.ts` |
| Cart (config snapshot, qty, subtotal) | `pages/CartPage.tsx` |
| Admin auth guard | `components/ProtectedRoute.tsx` |
| Category CRUD | `pages/admin/AdminCategories.tsx` |
| Product list + dynamic create form | `pages/admin/AdminProducts.tsx` + `components/admin/ProductForm.tsx` |

> Reset the demo catalog any time by clearing the site's localStorage — it
> re-seeds on next load.
