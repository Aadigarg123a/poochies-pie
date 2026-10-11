import { CATEGORIES, FLAVOURS, type Category, type Flavour, type FlavourId, type Product } from '@/data/menu'
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
