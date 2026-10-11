import { FLAVOURS, type Flavour, type FlavourId, type Product, type Protein, type Species } from '@/data/menu'
import type { Pawfile } from '@/stores/pawfile'

export interface Conflict {
  kind: 'allergy' | 'species'
  message: string
}

const PROTEIN_LABEL: Record<Protein, string> = { chicken: 'chicken', mutton: 'mutton', fish: 'fish' }

export function proteinLabel(p: Protein) {
  return PROTEIN_LABEL[p]
}

function allergyConflicts(proteins: readonly Protein[], pawfile: Pick<Pawfile, 'name' | 'allergies'>): Conflict[] {
  const hits = proteins.filter((p) => pawfile.allergies.includes(p))
  return hits.map((p) => ({
    kind: 'allergy',
    message: `Contains ${PROTEIN_LABEL[p]}: ${pawfile.name || 'your pet'} is allergic`,
  }))
}

/** Conflicts for a single flavour (cakes, mini cakes, dognuts, cupcakes). */
export function flavourConflicts(id: FlavourId, pawfile: Pick<Pawfile, 'name' | 'allergies'> | null): Conflict[] {
  if (!pawfile) return []
  const flavour = FLAVOURS.find((f) => f.id === id) as Flavour | undefined
  return flavour ? allergyConflicts(flavour.proteins, pawfile) : []
}

function speciesConflict(species: readonly Species[], pawfile: Pick<Pawfile, 'name' | 'species'>): Conflict | null {
  if (species.includes(pawfile.species)) return null
  return pawfile.species === 'cat'
    ? { kind: 'species', message: 'Not yet confirmed for cats: ask us on WhatsApp' }
    : { kind: 'species', message: 'Made for cats' }
}

/**
 * Conflicts for a whole product. Products priced by flavour only conflict on
 * species here; their flavours are flagged one by one.
 */
export function productConflicts(product: Product, pawfile: Pawfile | null): Conflict[] {
  if (!pawfile) return []
  const out: Conflict[] = []
  const sp = speciesConflict(product.species, pawfile)
  if (sp) out.push(sp)
  if (product.diet !== 'by-flavour') out.push(...allergyConflicts(product.proteins, pawfile))
  return out
}

/** For by-flavour products: how many flavours the pet should avoid. */
export function avoidFlavourCount(flavourIds: readonly FlavourId[], pawfile: Pawfile | null): number {
  if (!pawfile?.allergies.length) return 0
  return flavourIds.filter((id) => flavourConflicts(id, pawfile).length > 0).length
}
