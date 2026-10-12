# Poochie's Pie

Haute pâtisserie for pets, Delhi. The website for a home-based, made-to-order pet bakery: menu, cake builder (the Atelier), Pawrty Planner, Pawfile and a WhatsApp concierge checkout.

Built with Next.js 16 (App Router, fully static), TypeScript, Tailwind CSS 4, Zustand, Zod and Motion. Tested with Vitest and Playwright. Hosted on Netlify.

Open owner questions and placeholders: **[OWNER_TODO.md](OWNER_TODO.md)**.

## Run it locally

Requires Node 22+ and pnpm.

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

| Command | What it does |
|---|---|
| `pnpm dev` | Development server |
| `pnpm build` | Validates the menu (Zod), then builds the static site |
| `pnpm start` | Serves the production build |
| `pnpm typecheck` / `pnpm lint` | TypeScript and ESLint |
| `pnpm test` | Unit tests: menu integrity, pricing, dates, WhatsApp message, Pawfile, .ics, SEO, copy audit |
| `pnpm e2e` | Playwright on mobile and desktop (run `pnpm build` first) |
| `pnpm copy:audit` | Fails if the built pages make unbacked claims ("vet-approved", "award", "5-star", "review", …) |
| `pnpm lighthouse` | Lighthouse mobile, median of 3 runs, against `pnpm start --port 3300` |

CI (GitHub Actions) runs typecheck, lint, unit tests, build and E2E on every pull request.

## How to change prices or the menu

**Every item and price lives in one file: [`src/data/menu.ts`](src/data/menu.ts).** The menu page, product pages, the Atelier, the Pawrty Planner, the bag and the WhatsApp message all read from it.

1. Edit the price in `src/data/menu.ts` (whole rupees, e.g. `1150`).
2. Make the same change in `tests/unit/expected-menu.ts`. This is deliberate: the menu-integrity test compares the two, so a typo can never reach customers.
3. Run `pnpm test`. If it's green, commit and push. Netlify redeploys automatically.

Size rules live in `CAKE_SIZE_RULES` in the same file (1 kg = ½ kg price + ₹800; Bone-shaped 1 kg = ½ kg price + ₹900). Ordering rules (lead time, cut-off) are in `src/config/ordering.ts`. Brand facts (phone, Instagram, Google profile, delivery area) are in `src/data/site.ts`.

## How to add photos

Photos are wired through one component (`ProductImage`) and one map, [`src/data/photos.ts`](src/data/photos.ts):

1. Put the original in `src/assets/photos/` (JPG/PNG, at least 1600 px wide).
2. Import it in `src/data/photos.ts` and map it to the product's slug, with a description:
   ```ts
   import beer from '@/assets/photos/beer.jpg'
   export const PHOTOS = { 'pet-friendly-beer': { src: beer, alt: 'A bottle of chicken-based pet beer beside a dog bowl' } }
   ```
3. For the home hero, set `HERO_PHOTO` in the same file.

`next/image` serves AVIF/WebP at the right size. Until a slug has a photo, an art-directed placeholder with the item's name is shown. Don't use stock photos of other bakeries' cakes.

## Fonts

All fonts are self-hosted and subset to the characters the site uses, so phones download only ~60 KB of fonts. If the copy starts using new characters in the display serif (e.g. a new accented letter), re-run `node scripts/fetch-fonts.mjs` (OFL fonts from Google Fonts).

## Checkout

v1 has no online payment. The bag becomes a pre-filled WhatsApp message to +91 98100 15052 (items, total, date, delivery/pick-up, pet, allergies, gift details). The owner confirms and asks for advance payment, as today. A payment gateway (e.g. Razorpay) can be added later behind `NEXT_PUBLIC_CHECKOUT_PROVIDER` via the `CheckoutProvider` interface in `src/lib/checkout.ts`. It is stubbed and off.

## Deploy (Netlify)

The site is connected to Netlify from the GitHub repo:

- **`main` → production.** Every merge to `main` deploys.
- **Pull requests → deploy previews.** Each PR gets its own preview URL.
- Netlify builds Next.js natively. Settings are in [`netlify.toml`](netlify.toml) (Node 24, `pnpm build`). The Next.js runtime (`@netlify/plugin-nextjs`) is pinned there on purpose: a build without it publishes the raw `.next` folder and every page 404s.
- The repo is linked with a read-only deploy key and a GitHub webhook (push, pull request). On Netlify's Free plan, builds of this private repo only run for commits whose author is a GitHub account connected to a member of the Netlify team; commits from an unknown identity show "Build blocked: Unrecognized Git contributor".

Live site: **https://poochies-pie.netlify.app** (Netlify project `poochies-pie`). The "Built with Netlify" badge/toolbar is switched off on purpose: on phones it covered the Atelier's sticky "Add to bag" bar.

To test a deployed site end to end: `E2E_BASE_URL=https://poochies-pie.netlify.app pnpm e2e`.

Environment variables (Netlify → Site configuration → Environment variables):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | The live URL, e.g. `https://poochiespie.in` (used for canonical links, sitemap, share images) |
| `NEXT_PUBLIC_SHOW_TODOS` | `true` on previews; `false` in production once OWNER_TODO is done |
| `NEXT_PUBLIC_CHECKOUT_PROVIDER` | `whatsapp` |

Manual deploy from a laptop (log in once with `pnpm --package=netlify-cli dlx netlify login`):

```bash
pnpm --package=netlify-cli dlx netlify deploy --build          # draft preview URL
pnpm --package=netlify-cli dlx netlify deploy --build --prod   # production
```

## Project map

```
src/data/menu.ts          the menu: single source of truth for items and prices
src/data/site.ts          brand facts (phone, Instagram, area, TODOs)
src/lib/pricing.ts        all price maths (cakes, packs, items)
src/lib/whatsapp.ts       the WhatsApp order message
src/lib/ics.ts            birthday reminder calendar file
src/app/                  pages (/, /menu, /atelier, /pawrty, /treats/[slug], …), SEO files
src/components/           UI, layout, menu, atelier, cart, pawfile, pawrty, product
tests/unit, tests/e2e     Vitest and Playwright
scripts/                  menu validation, copy audit, Lighthouse, font subsetting, icons
```
