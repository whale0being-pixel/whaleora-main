# Whaleora

The Whaleora storefront: personal safety tools — a 130dB SOS alarm, a whistle, pepper spray and a car window breaker — sold across India.

Next.js 16 on the App Router, with Shopify as the commerce backend, Convex for everything Shopify does not hold, and a small content studio at `/admin` for the copy that changes often.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
```

Node 22.13 or newer. There is no required configuration to get a working site on screen: with nothing set, the catalogue falls back to the four products in `data/products.ts`, the editorial content falls back to the bundled demo set, and anything needing Convex renders its empty state rather than an error. Each integration switches itself on when its variables appear.

That fallback is deliberate — it means a broken Shopify token degrades to stale prices rather than a blank shop.

## Environment

Nothing here is checked in. Put development values in `.env.local`, which is gitignored.

| Variable | What turns on |
| --- | --- |
| `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Live prices, stock and cart. Without them the site serves `data/products.ts`. |
| `SHOPIFY_CUSTOMER_CLIENT_ID`, `SHOPIFY_CUSTOMER_CLIENT_SECRET`, `SHOPIFY_CUSTOMER_SESSION_SECRET` | Customer sign-in at `/account`. |
| `NEXT_PUBLIC_CONVEX_URL` | Customer reviews, order lookup, emergency cards, and saved studio content. |
| `ORDERS_INGEST_SECRET` | Shared with the Convex deployment. Authorises this server to Convex for writes and moderation. |
| `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `ADMIN_ORIGIN` | The content studio at `/admin`. |
| `UPLOADTHING_TOKEN` | Photos on customer reviews. Unset, the review form drops its photo picker and works as before. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `ENQUIRY_TO`, `ENQUIRY_FROM` | Contact and institution enquiry email. |

`SHOPIFY_*` names have aliases, because the Vercel Marketplace integration and a hand-made custom app name the same values differently — see `pick()` in `lib/shopify/client.ts`.

`ADMIN.md` covers the studio, the production variables and the Convex content document in full.

## How it fits together

```
app/            Routes. Product pages, Safety Hub, account, admin, API handlers.
components/     Mostly client components — anything holding state or opening a dialog.
convex/         Schema and server functions: orders, reviews, content, emergency cards.
lib/            The seams — shopify/, content/, email/, faq/, admin/, convex.ts, images.ts.
data/           Bundled product, guide and checklist content. The no-Shopify fallback.
tests/          node --test suites over the pure logic in lib/.
scripts/        One-off checks: shopify:check, mail:check.
```

Two things worth knowing before changing anything:

**Product photos go through Shopify's CDN, not Next's optimiser.** The media is 2048px PNGs of several megabytes, and Shopify will serve them as ~80 KB WebP — but only to a client whose `Accept` header asks for it, which Next's optimiser never sends. `lib/images.ts` explains the loader that handles this. The hosts an image may come from live there too, and `next.config.ts` builds the optimiser's allowlist from the same lists, so a URL the studio accepts is a URL the optimiser serves.

**Reviews publish on arrival.** `convex/reviewFilter.ts` holds a review back only for abuse and spam — never for criticism of the product. "Useless", "waste of money" and "broke in a week" all go up immediately, on purpose. A review section that quietly swallowed complaints would be worthless to the people reading it.

## Checks

```bash
npm run lint
npx tsc --noEmit
npm test              # node --test over tests/*.test.mjs
npm run shopify:check # confirms the Storefront credentials answer
npm run mail:check    # connects and authenticates; add -- --send to post a real test enquiry
```

`tests/admin-integration.mjs` is separate and runs against a throwaway server; `ADMIN.md` has the recipe.

## Deploying

Vercel, from `main`. Set the server-side variables in the project (never prefixed `NEXT_PUBLIC_` unless they are genuinely public), and keep preview and production on different `CONTENT_NAMESPACE` values — they are rows in one Convex table, so a shared name means one environment overwrites the other.

Convex deploys separately with `npx convex deploy`. A push that changes `convex/` is not live until that runs.

Vercel has no writable disk, so the studio's local `/api/media` uploads are unavailable there: point video and image fields at Shopify Files or another host. Review photos are unaffected — they go to UploadThing.
