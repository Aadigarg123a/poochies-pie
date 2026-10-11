/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  THE MENU — the single source of truth for every item and price on the site.
 * ─────────────────────────────────────────────────────────────────────────────
 *  Transcribed exactly from Poochie's Pie's printed menu. Every page, the cake
 *  builder, the cart and the WhatsApp message read from this file.
 *
 *  • Prices are whole rupees (INR integers). Never store paise or strings.
 *  • To change a price: edit it here AND in tests/unit/expected-menu.ts.
 *    The menu-integrity test fails on purpose until both match, so a typo can
 *    never reach customers.
 *  • `pnpm build` runs scripts/validate-menu.ts (Zod) first; a malformed edit
 *    stops the build.
 */

export type Diet = 'veg' | 'non-veg'
/** Only proteins that are evident from an item's name on the menu. */
export type Protein = 'chicken' | 'mutton' | 'fish'
export type Species = 'dog' | 'cat'
export type Category = 'cakes' | 'mini-cakes' | 'dognuts' | 'cupcakes' | 'treats' | 'accessories'

export interface Flavour {
  id: string
  name: string
  diet: Diet
  proteins: readonly Protein[]
  /** A one-line "perfume note". Poetic, never an ingredient claim beyond the name. */
  note: string
}

/* ── Flavours ─────────────────────────────────────────────────────────────── */

export const FLAVOURS = [
  { id: 'going-bananas', name: 'Going Bananas', diet: 'veg', proteins: [], note: 'Ripe banana, gloriously over-excited.' },
  { id: 'carrot-twist', name: 'Carrot Twist', diet: 'veg', proteins: [], note: 'Garden carrot, with a twist of mischief.' },
  { id: 'pumpkin-lava', name: 'Pumpkin Lava', diet: 'veg', proteins: [], note: 'Pumpkin with a heart worthy of its name.' },
  { id: 'apple-of-my-pie', name: 'Apple of my Pie', diet: 'veg', proteins: [], note: 'Orchard apple. The house signature.' },
  { id: 'mango-masti', name: 'Mango Masti', diet: 'veg', proteins: [], note: 'Summer mango and pure masti.' },
  { id: 'chicken-overloaded', name: 'Chicken Overloaded', diet: 'non-veg', proteins: ['chicken'], note: 'Chicken, and then a little more chicken.' },
  { id: 'chicken-farmhouse', name: 'Chicken Farmhouse', diet: 'non-veg', proteins: ['chicken'], note: 'Chicken with a homely, farmhouse soul.' },
  { id: 'mutton-delight', name: 'Mutton Delight', diet: 'non-veg', proteins: ['mutton'], note: 'Savoury mutton for the connoisseur.' },
  { id: 'somethings-fishy', name: "Something's Fishy", diet: 'non-veg', proteins: ['fish'], note: 'Fish, for the most discerning nose.' },
] as const satisfies readonly Flavour[]

export type FlavourId = (typeof FLAVOURS)[number]['id']

/** The shared list used by Crazy Dognuts and Rainbow Cupcakes. */
export const SHARED_FLAVOUR_IDS = [
  'apple-of-my-pie',
  'going-bananas',
  'carrot-twist',
  'pumpkin-lava',
  'chicken-overloaded',
  'chicken-farmhouse',
] as const satisfies readonly FlavourId[]

export type SharedFlavourId = (typeof SHARED_FLAVOUR_IDS)[number]

/* ── Frosting ─────────────────────────────────────────────────────────────── */

export const FROSTINGS = [
  { id: 'cream-cheese', name: 'Cream cheese', description: 'Our standard frosting.' },
  { id: 'curd-sweet-potato', name: 'Curd & sweet potato', description: 'For pets with food allergies.' },
] as const

export type FrostingId = (typeof FROSTINGS)[number]['id']

/* ── Cake add-ons ─────────────────────────────────────────────────────────── */

export type AddOnId = 'cheese' | 'coconut' | 'paw-design' | 'mini-face' | 'full-face' | 'name-banner'

export interface AddOn {
  id: AddOnId
  name: string
  price: number
  /** Add-ons that share a group are mutually exclusive. */
  exclusiveGroup?: 'face'
}

/** Add-ons for ½ kg cakes (also used for 1 kg and Bone-shaped 1 kg cakes). */
export const HALF_KG_ADD_ONS = [
  { id: 'cheese', name: 'Cheese', price: 50 },
  { id: 'coconut', name: 'Coconut', price: 50 },
  { id: 'paw-design', name: 'Paw Design', price: 60 },
  { id: 'mini-face', name: 'Mini Face', price: 100, exclusiveGroup: 'face' },
  { id: 'full-face', name: 'Full Face Cake', price: 150, exclusiveGroup: 'face' },
  { id: 'name-banner', name: 'Name Banner', price: 100 },
] as const satisfies readonly AddOn[]

/** Add-ons for Special Mini Cakes. DIFFERENT prices: never reuse the ½ kg list. */
export const MINI_ADD_ONS = [
  { id: 'cheese', name: 'Cheese', price: 50 },
  { id: 'coconut', name: 'Coconut', price: 50 },
  { id: 'paw-design', name: 'Paw Design', price: 60 },
  { id: 'mini-face', name: 'Mini Face', price: 50, exclusiveGroup: 'face' },
  { id: 'full-face', name: 'Full Face Cake', price: 100, exclusiveGroup: 'face' },
  { id: 'name-banner', name: 'Name Banner', price: 50 },
] as const satisfies readonly AddOn[]

/* ── Cake sizes ───────────────────────────────────────────────────────────── */

/**
 * Size rules, as printed on the menu ("1 kg cakes +800", "Bone-shaped (only 1 kg) +900").
 * Owner confirmed (2026-10-11): Bone-shaped 1 kg = ½ kg flavour price + ₹900.
 * Change `boneBasis` to 'one-kg' if that ever becomes "1 kg price + ₹900".
 */
export const CAKE_SIZE_RULES = {
  oneKgSurcharge: 800,
  boneSurcharge: 900,
  boneBasis: 'half-kg' as 'half-kg' | 'one-kg',
}

export type CakeSize = 'mini' | 'half-kg' | 'one-kg' | 'bone-one-kg'

export const CAKE_SIZES = [
  { id: 'mini', name: 'Special Mini', weight: '250–300 g' },
  { id: 'half-kg', name: 'Half kilo', weight: '½ kg' },
  { id: 'one-kg', name: 'One kilo', weight: '1 kg' },
  { id: 'bone-one-kg', name: 'Bone-shaped', weight: '1 kg' },
] as const satisfies readonly { id: CakeSize; name: string; weight: string }[]

/* ── Products ─────────────────────────────────────────────────────────────── */

interface ProductBase {
  slug: string
  name: string
  category: Category
  /** Short editorial line for cards. */
  tagline: string
  /** Species the owner has confirmed. Anything not listed for cats shows "Cats: ask us". */
  species: readonly Species[]
  /** Confirmed diet. `null` = not stated on the menu (TODO(owner)). */
  diet: Diet | 'by-flavour' | null
  proteins: readonly Protein[]
  /** True for food. Food carries the "Never in it" promise. */
  isFood: boolean
  /** Frosting choice applies (cream cheese, or curd & sweet potato for allergies). */
  frosted: boolean
  /** Storage note applies ("Baked products keep 2–3 days refrigerated"). */
  baked: boolean
}

export interface Variant {
  id: string
  name: string
  price: number
}

export interface CakeProduct extends ProductBase {
  kind: 'cake'
  /** ½ kg price per flavour. 1 kg and Bone-shaped are derived via CAKE_SIZE_RULES. */
  halfKgPrices: Record<FlavourId, number>
}

export interface MiniCakeProduct extends ProductBase {
  kind: 'mini-cake'
  weight: string
  prices: Record<FlavourId, number>
}

export interface PackProduct extends ProductBase {
  kind: 'dognuts' | 'cupcakes'
  packLabel: 'Pack' | 'Box'
  packs: readonly { count: number; veg: number; nonVeg: number }[]
  /** Rainbow Cupcakes only: +₹ per face add-on, per cupcake. */
  facePerPiece?: number
}

export interface SimpleProduct extends ProductBase {
  kind: 'treat' | 'accessory'
  variants: readonly Variant[]
  /** e.g. Pup-icecream flavours. */
  options?: { label: string; values: readonly string[] }
  servedWith?: string
  /** Free-text facts printed on the menu for this item. */
  facts?: readonly string[]
}

export type Product = CakeProduct | MiniCakeProduct | PackProduct | SimpleProduct

const DOG: readonly Species[] = ['dog']

export const PRODUCTS = [
  {
    kind: 'cake',
    slug: 'celebration-cake',
    name: 'Celebration Cake',
    category: 'cakes',
    tagline: 'Half kilo, one kilo or bone-shaped. Nine flavours.',
    species: DOG,
    diet: 'by-flavour',
    proteins: [],
    isFood: true,
    frosted: true,
    baked: true,
    halfKgPrices: {
      'going-bananas': 1100,
      'carrot-twist': 1100,
      'pumpkin-lava': 1100,
      'apple-of-my-pie': 1150,
      'mango-masti': 1150,
      'chicken-overloaded': 1200,
      'chicken-farmhouse': 1200,
      'mutton-delight': 1250,
      'somethings-fishy': 1250,
    },
  },
  {
    kind: 'mini-cake',
    slug: 'special-mini-cake',
    name: "Poochie's Pie Special Mini Cake",
    category: 'mini-cakes',
    tagline: 'All nine flavours, made petite.',
    weight: '250–300 g',
    species: DOG,
    diet: 'by-flavour',
    proteins: [],
    isFood: true,
    frosted: true,
    baked: true,
    prices: {
      'going-bananas': 700,
      'carrot-twist': 700,
      'pumpkin-lava': 700,
      'apple-of-my-pie': 750,
      'mango-masti': 750,
      'chicken-overloaded': 800,
      'chicken-farmhouse': 800,
      'mutton-delight': 850,
      'somethings-fishy': 850,
    },
  },
  {
    kind: 'dognuts',
    slug: 'crazy-dognuts',
    name: 'Crazy Dognuts',
    category: 'dognuts',
    tagline: 'Doughnuts, reimagined for dogs.',
    species: DOG,
    diet: 'by-flavour',
    proteins: [],
    isFood: true,
    frosted: false,
    baked: true,
    packLabel: 'Pack',
    packs: [
      { count: 2, veg: 500, nonVeg: 550 },
      { count: 4, veg: 700, nonVeg: 750 },
      { count: 6, veg: 900, nonVeg: 950 },
    ],
  },
  {
    kind: 'cupcakes',
    slug: 'rainbow-cupcakes',
    name: 'Rainbow Cupcakes',
    category: 'cupcakes',
    tagline: 'A box for the guest list.',
    species: DOG,
    diet: 'by-flavour',
    proteins: [],
    isFood: true,
    frosted: true,
    baked: true,
    packLabel: 'Box',
    packs: [
      { count: 4, veg: 750, nonVeg: 800 },
      { count: 6, veg: 1050, nonVeg: 1100 },
    ],
    facePerPiece: 50,
  },
  {
    kind: 'treat',
    slug: 'protein-idlis',
    name: 'Protein Idlis',
    category: 'treats',
    tagline: 'Served with a pumpkin chutney.',
    servedWith: 'Pumpkin Chutney',
    species: DOG,
    diet: 'veg',
    proteins: [],
    isFood: true,
    frosted: false,
    baked: false,
    variants: [
      { id: 'pack-4', name: 'Pack of 4', price: 500 },
      { id: 'pack-8', name: 'Pack of 8', price: 800 },
    ],
  },
  {
    kind: 'treat',
    slug: 'pup-icecream',
    name: 'Pup-icecream',
    category: 'treats',
    tagline: 'Mango, or banana-peanutbutter.',
    species: DOG,
    diet: null,
    proteins: [],
    isFood: true,
    frosted: false,
    baked: false,
    options: { label: 'Flavour', values: ['Mango', 'Banana-peanutbutter'] },
    variants: [
      { id: '250-ml', name: '250 ml', price: 300 },
      { id: '500-ml', name: '500 ml', price: 500 },
    ],
  },
  {
    kind: 'treat',
    slug: 'coconut-ladoos',
    name: 'Coconut Ladoos',
    category: 'treats',
    tagline: 'A festive classic, pet-perfected.',
    species: DOG,
    diet: null,
    proteins: [],
    isFood: true,
    frosted: false,
    baked: false,
    variants: [
      { id: '250-g', name: '250 g', price: 400 },
      { id: '500-g', name: '500 g', price: 700 },
    ],
  },
  {
    kind: 'treat',
    slug: 'pet-friendly-beer',
    name: 'Pet-Friendly Beer',
    category: 'treats',
    tagline: 'Chicken-based and non-alcoholic. For dogs & cats.',
    species: ['dog', 'cat'],
    diet: 'non-veg',
    proteins: ['chicken'],
    isFood: true,
    frosted: false,
    baked: false,
    facts: ['Suitable for dogs & cats', 'Non-alcoholic'],
    variants: [{ id: 'chicken-beer', name: 'Chicken-based Beer', price: 350 }],
  },
  {
    kind: 'treat',
    slug: 'gluten-free-cookies',
    name: 'Gluten-Free Cookies',
    category: 'treats',
    tagline: 'Pumpkin-carrot, shaped like little faces.',
    species: DOG,
    diet: null,
    proteins: [],
    isFood: true,
    frosted: false,
    baked: true,
    facts: ['Gluten-free'],
    variants: [{ id: 'face-cookies', name: 'Pumpkin-carrot face-shaped cookies', price: 350 }],
  },
  {
    kind: 'accessory',
    slug: 'happy-birthday-cap',
    name: 'Happy Birthday Cap',
    category: 'accessories',
    tagline: 'The finishing touch.',
    species: DOG,
    diet: null,
    proteins: [],
    isFood: false,
    frosted: false,
    baked: false,
    variants: [{ id: 'one-size', name: 'Happy Birthday Cap', price: 50 }],
  },
  {
    kind: 'accessory',
    slug: 'tuxedo-bandana',
    name: 'Tuxedo Bandana',
    category: 'accessories',
    tagline: 'Black tie, optional.',
    species: DOG,
    diet: null,
    proteins: [],
    isFood: false,
    frosted: false,
    baked: false,
    variants: [
      { id: 'small-medium', name: 'Small-Medium', price: 450 },
      { id: 'large', name: 'Large', price: 500 },
    ],
  },
  {
    kind: 'accessory',
    slug: 'sailor-bow',
    name: 'Sailor Bow',
    category: 'accessories',
    tagline: 'Nautical, and very nice.',
    species: DOG,
    diet: null,
    proteins: [],
    isFood: false,
    frosted: false,
    baked: false,
    variants: [
      { id: 'without-neck-band', name: 'without Neck Band', price: 350 },
      { id: 'with-neck-band', name: 'with Neck Band', price: 400 },
    ],
  },
  {
    kind: 'accessory',
    slug: 'bow-with-neck-band',
    name: 'Bow with Neck Band',
    category: 'accessories',
    tagline: 'A classic bow for every size.',
    species: DOG,
    diet: null,
    proteins: [],
    isFood: false,
    frosted: false,
    baked: false,
    variants: [
      { id: 'small-breeds', name: 'Small Breeds', price: 350 },
      { id: 'big-breeds', name: 'Big Breeds', price: 400 },
    ],
  },
  {
    kind: 'accessory',
    slug: 'happy-birthday-bandana',
    name: 'Happy Birthday Bandana',
    category: 'accessories',
    tagline: 'Birthday, announced.',
    species: DOG,
    diet: null,
    proteins: [],
    isFood: false,
    frosted: false,
    baked: false,
    variants: [
      { id: 'small', name: 'Small', price: 350 },
      { id: 'medium-large', name: 'Medium-Large', price: 400 },
    ],
  },
  {
    kind: 'accessory',
    slug: 'ethnic-bow',
    name: 'Ethnic Bow with Neck Band',
    category: 'accessories',
    tagline: 'Festive finery.',
    species: DOG,
    diet: null,
    proteins: [],
    isFood: false,
    frosted: false,
    baked: false,
    variants: [
      { id: 'small', name: 'Small', price: 300 },
      { id: 'medium-large', name: 'Medium-Large', price: 350 },
    ],
  },
  {
    kind: 'accessory',
    slug: 'cat-bow-tie',
    name: 'Bow-tie for Cats',
    category: 'accessories',
    tagline: 'For the feline in charge.',
    species: ['cat'],
    diet: null,
    proteins: [],
    isFood: false,
    frosted: false,
    baked: false,
    variants: [{ id: 'one-size', name: 'Bow-tie for cats', price: 150 }],
  },
] as const satisfies readonly Product[]

export type ProductSlug = (typeof PRODUCTS)[number]['slug']

export const CATEGORIES = [
  { id: 'cakes', name: 'Cakes' },
  { id: 'mini-cakes', name: 'Mini Cakes' },
  { id: 'dognuts', name: 'Dognuts' },
  { id: 'cupcakes', name: 'Cupcakes' },
  { id: 'treats', name: 'Treats' },
  { id: 'accessories', name: 'Accessories' },
] as const satisfies readonly { id: Category; name: string }[]

/* ── Lookups ──────────────────────────────────────────────────────────────── */

export function getFlavour(id: FlavourId): Flavour {
  const flavour = FLAVOURS.find((f) => f.id === id)
  if (!flavour) throw new Error(`Unknown flavour: ${id}`)
  return flavour
}

export function getProduct(slug: string): Product | undefined {
  return (PRODUCTS as readonly Product[]).find((p) => p.slug === slug)
}

export function isSharedFlavour(id: string): id is SharedFlavourId {
  return (SHARED_FLAVOUR_IDS as readonly string[]).includes(id)
}

export const CAKE = PRODUCTS[0] satisfies CakeProduct
export const MINI_CAKE = PRODUCTS[1] satisfies MiniCakeProduct
export const DOGNUTS = PRODUCTS[2] satisfies PackProduct
export const CUPCAKES = PRODUCTS[3] satisfies PackProduct
