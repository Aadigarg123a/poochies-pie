# Owner TODO: Poochie's Pie website

Everything below is a placeholder on the site today. Nothing here has been guessed or invented. On preview builds each gap shows as a dashed **TODO(owner)** note. Once you've filled them in, set `NEXT_PUBLIC_SHOW_TODOS=false` in Netlify and the site shows polite fallback copy instead.

Send answers on WhatsApp or by email. Where it says "file", the developer updates that file.

## Brand & content

| # | What we need | Where it shows | File |
|---|---|---|---|
| 1 | **Logo**: the circular logo mark (SVG preferred, or a large PNG) plus the fonts used on the printed menu | Header, footer, favicon, share images (the typeset "Poochie's Pie" wordmark and "PP" seal are placeholders) | `src/components/layout/Wordmark.tsx`, `src/app/icon.svg` |
| 2 | **Product photos**: 10–20 originals from Instagram (with permission), and which 3 are hero-worthy | Every product card and page, the home hero (art-directed placeholders today) | `src/data/photos.ts` |
| 3 | **Founder / brand story**: a few short paragraphs, a photo if you like | `/about` | `src/app/about/page.tsx` (`STORY`) |
| 4 | **Instagram posts** to feature: 3–6 post URLs | Home "Follow the bakes" strip (loads only when tapped) | `src/data/site.ts` → `instagram.embedPosts` |
| 5 | **Google Business Profile** link | Footer, Contact, structured data (`sameAs`) | `src/data/site.ts` → `googleProfileUrl` |
| 6 | **Reviews** you're happy for us to quote (names/initials) | Nothing today: no reviews or ratings are shown or marked up. The copy audit blocks the word "review" until you allow it | `scripts/copy-audit.allow.json` |

## Ordering & delivery

| # | What we need | Where it shows | File |
|---|---|---|---|
| 7 | **Service area**: all of Delhi NCR, or specific zones? | How to order, About, footer, structured data | `src/data/site.ts` → `areaServed` |
| 8 | **Delivery charge rules**: the menu only says "delivery charges apply" | Bag (details step), How to order, FAQ | `src/data/site.ts` → `deliveryCharges` |
| 9 | **Pick-up locality** (area name only) | Bag, How to order | `src/data/site.ts` → `pickupLocality` |
| 10 | **Next-day cut-off time**: e.g. orders for tomorrow close at 6 pm? (none today) | Date picker | `src/config/ordering.ts` → `nextDayCutoff` |
| 11 | **Payment details flow**: manual on WhatsApp today; online payment (Razorpay) can be added later | Bag | `src/config/flags.ts`, `src/lib/checkout.ts` |

## Menu facts we don't have

| # | Question | File |
|---|---|---|
| 12 | **Gluten-Free Cookies**: how many cookies in a pack? | `src/data/menu.ts` → `ownerTodos` |
| 13 | **Veg or non-veg?** Pup-icecream, Coconut Ladoos and Gluten-Free Cookies carry no mark on the menu, so they show none (and drop out of the Veg/Non-veg filters) | `src/data/menu.ts` → `diet` |
| 14 | **Which items suit cats?** Only the Pet-Friendly Beer and Bow-ties for cats are confirmed; everything else says "Cats: ask us" | `src/data/menu.ts` → `species` |
| 15 | **Ingredient list** for each food item (the "What's in it" card shows a placeholder) | product pages |
| 16 | **Storage** for non-baked items: Protein Idlis, Pup-icecream, Coconut Ladoos, Pet-Friendly Beer (the 2–3-day fridge note applies to baked goods only) | product pages |
| 17 | **Add-on prices on 1 kg & Bone-shaped cakes**: we assumed they're the same as the ½ kg add-on list (e.g. Name Banner +₹100). Correct? | `src/data/menu.ts` |
| 18 | **Dognuts**: do they take the cream-cheese / curd & sweet potato frosting? | `src/data/menu.ts` → `frosted` |
| 19 | **Mixed flavours** in one Dognut pack or cupcake box? (Today: one flavour per pack; customers can ask in the notes) | builder / product pages |
| 20 | **Pawrty set discount**: none today; sets are priced as the plain sum | `src/config/flags.ts` → `bundleDiscountPercent` |

## Launch

| # | What we need | File |
|---|---|---|
| 21 | **Domain name**: then set `NEXT_PUBLIC_SITE_URL` in Netlify so canonical links, the sitemap and share images use it | Netlify → Site configuration → Environment variables |
| 22 | **Analytics** (optional): the brief's Vercel Analytics doesn't run on Netlify. Netlify Analytics is server-side and cookie-free (paid add-on), or we can leave it off | Netlify dashboard |
| 23 | When 1–21 are filled: set `NEXT_PUBLIC_SHOW_TODOS=false` to hide these notes | Netlify env |
