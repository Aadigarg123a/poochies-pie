import { CATEGORIES, FLAVOURS, PRODUCTS, SHARED_FLAVOUR_IDS, type Category, type Flavour, type FlavourId, type Product } from '@/data/menu'
import { flavourConflicts, productConflicts } from '@/lib/pawfile'
import type { Pawfile } from '@/stores/pawfile'

export interface MenuFilters {
  pet: 'all' | 'dog' | 'cat'
  diet: 'all' | 'veg' | 'non-veg'
  category: 'all' | Category
  /** Hide items that conflict with the Pawfile. */
  safe: boolean
}

export const DEFAULT_FILTERS: MenuFilters = { pet: 'all', diet: 'all', category: 'all', safe: false }

const PETS = ['dog', 'cat'] as const
const DIETS = ['veg', 'non-veg'] as const

export function parseFilters(params: Pick<URLSearchParams, 'get'>): MenuFilters {
  const pet = params.get('pet')
  const diet = params.get('diet')
  const c = params.get('c')
  return {
    pet: (PETS as readonly string[]).includes(pet ?? '') ? (pet as MenuFilters['pet']) : 'all',
    diet: (DIETS as readonly string[]).includes(diet ?? '') ? (diet as MenuFilters['diet']) : 'all',
    category: CATEGORIES.some((x) => x.id === c) ? (c as Category) : 'all',
    safe: params.get('safe') === '1',
  }
}

export function filtersToQuery(f: MenuFilters): string {
  const q = new URLSearchParams()
  if (f.category !== 'all') q.set('c', f.category)
  if (f.pet !== 'all') q.set('pet', f.pet)
  if (f.diet !== 'all') q.set('diet', f.diet)
  if (f.safe) q.set('safe', '1')
  const s = q.toString()
  return s ? `?${s}` : ''
}

export function isFiltered(f: MenuFilters) {
  return f.pet !== 'all' || f.diet !== 'all' || f.category !== 'all' || f.safe
}

export function flavourVisible(id: FlavourId, f: MenuFilters, pawfile: Pawfile | null): boolean {
  const flavour = FLAVOURS.find((x) => x.id === id) as Flavour
  if (f.diet !== 'all' && flavour.diet !== f.diet) return false
  if (f.safe && flavourConflicts(id, pawfile).length) return false
  return true
}

export function productVisible(product: Product, f: MenuFilters, pawfile: Pawfile | null, flavourIds?: readonly FlavourId[]): boolean {
  if (f.category !== 'all' && product.category !== f.category) return false
  if (f.pet !== 'all' && !product.species.includes(f.pet)) return false
  if (f.diet !== 'all') {
    if (product.diet === 'by-flavour') {
      if (!(flavourIds ?? []).some((id) => flavourVisible(id, { ...f, safe: false }, pawfile))) return false
    } else if (product.diet !== f.diet) return false
  }
  if (f.safe && pawfile) {
    if (productConflicts(product, pawfile).length) return false
    if (product.diet === 'by-flavour' && !(flavourIds ?? []).some((id) => flavourVisible(id, f, pawfile))) return false
  }
  return true
}

const ALL_FLAVOURS = FLAVOURS.map((f) => f.id)

/** The flavours a product is offered in (empty for single-recipe items). */
export function flavourIdsFor(p: Product): readonly FlavourId[] {
  if (p.kind === 'cake' || p.kind === 'mini-cake') return ALL_FLAVOURS
  if (p.kind === 'dognuts' || p.kind === 'cupcakes') return SHARED_FLAVOUR_IDS
  return []
}

/**
 * CSS selectors that hide everything the filters exclude. The menu itself is
 * server-rendered once; filtering only toggles visibility, so nothing heavy
 * has to re-render (or hydrate) in the browser.
 */
export function hiddenSelectors(f: MenuFilters, pawfile: Pawfile | null): { selectors: string[]; visibleCount: number } {
  const selectors: string[] = []
  let visibleCount = 0
  for (const c of CATEGORIES) {
    let sectionVisible = false
    for (const p of (PRODUCTS as readonly Product[]).filter((x) => x.category === c.id)) {
      const ids = flavourIdsFor(p)
      if (!productVisible(p, f, pawfile, ids)) {
        selectors.push(`[data-slug="${p.slug}"]`)
        continue
      }
      sectionVisible = true
      visibleCount++
      for (const id of ids) if (!flavourVisible(id, f, pawfile)) selectors.push(`[data-row="${p.slug}:${id}"]`)
    }
    if (!sectionVisible) selectors.push(`[data-section="${c.id}"]`)
  }
  if (f.diet === 'veg') selectors.push('[data-col="non-veg"]')
  if (f.diet === 'non-veg') selectors.push('[data-col="veg"]')
  return { selectors, visibleCount }
}
