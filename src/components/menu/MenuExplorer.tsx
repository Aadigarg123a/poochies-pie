'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FilterChip } from '@/components/ui/Choice'
import { CATEGORIES } from '@/data/menu'
import { DEFAULT_FILTERS, filtersToQuery, isFiltered, parseFilters, type MenuFilters } from '@/lib/menuFilters'
import { usePawfileStore } from '@/stores/pawfile'
import { useUIStore } from '@/stores/ui'
import { whatsappLink } from '@/data/site'
import { MenuView } from './MenuView'

/** Interactive menu: filters live in the URL so a filtered menu can be shared. */
export function MenuExplorer() {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const filters = parseFilters(params)
  const pawfile = usePawfileStore((s) => s.pawfile)

  const update = (patch: Partial<MenuFilters>) => {
    const next = { ...filters, ...patch }
    router.replace(`${pathname}${filtersToQuery(next)}`, { scroll: false })
  }

  return (
    <>
      <FilterBar filters={filters} onChange={update} hasPawfile={Boolean(pawfile)} petName={pawfile?.name} />
      {filters.pet === 'cat' ? (
        <p role="status" className="mt-8 rounded-[2px] border-l-2 border-blush bg-linen/70 px-5 py-4 text-[0.9375rem]">
          Showing the items we&rsquo;ve confirmed for cats. For anything else,{' '}
          <a className="font-semibold text-oxblood underline underline-offset-4" href={whatsappLink("Hello Poochie's Pie! Which of your treats suit my cat?")}>
            ask us on WhatsApp
          </a>
          .
        </p>
      ) : null}
      {filters.safe && pawfile ? (
        <p role="status" className="mt-8 rounded-[2px] border-l-2 border-blush bg-linen/70 px-5 py-4 text-[0.9375rem]">
          Hiding anything that conflicts with {pawfile.name || 'your pet'}&rsquo;s Pawfile. We can only check what the menu names
          (chicken, mutton, fish); please mention every allergy when you order.
        </p>
      ) : null}
      <MenuView filters={filters} pawfile={pawfile} />
    </>
  )
}

/** Static stand-in rendered into the prerendered HTML (before search params are known). */
export function MenuExplorerFallback() {
  return (
    <>
      <FilterBar filters={DEFAULT_FILTERS} onChange={() => {}} hasPawfile={false} disabled />
      <MenuView />
    </>
  )
}

function FilterBar({
  filters,
  onChange,
  hasPawfile,
  petName,
  disabled,
}: {
  filters: MenuFilters
  onChange: (patch: Partial<MenuFilters>) => void
  hasPawfile: boolean
  petName?: string
  disabled?: boolean
}) {
  const openPawfile = useUIStore((s) => s.openPawfile)
  const divider = <span aria-hidden="true" className="mx-1 h-6 w-px shrink-0 self-center bg-hairline" />
  return (
    <div className="sticky top-16 z-30 -mx-4 border-b hairline bg-cream/95 py-3 backdrop-blur-md sm:-mx-8 lg:-mx-12">
      <div
        aria-label="Filter the menu"
        aria-disabled={disabled || undefined}
        role="group"
        className="flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:px-8 lg:flex-wrap lg:px-12 [&::-webkit-scrollbar]:hidden"
      >
        <div role="group" aria-label="Category" className="flex shrink-0 gap-2 lg:flex-wrap">
          <FilterChip pressed={filters.category === 'all'} onClick={() => onChange({ category: 'all' })}>
            Everything
          </FilterChip>
          {CATEGORIES.map((c) => (
            <FilterChip key={c.id} pressed={filters.category === c.id} onClick={() => onChange({ category: filters.category === c.id ? 'all' : c.id })}>
              {c.name}
            </FilterChip>
          ))}
        </div>
        {divider}
        <div role="group" aria-label="Pet" className="flex shrink-0 gap-2">
          <FilterChip pressed={filters.pet === 'dog'} onClick={() => onChange({ pet: filters.pet === 'dog' ? 'all' : 'dog' })}>
            Dog
          </FilterChip>
          <FilterChip pressed={filters.pet === 'cat'} onClick={() => onChange({ pet: filters.pet === 'cat' ? 'all' : 'cat' })}>
            Cat
          </FilterChip>
        </div>
        {divider}
        <div role="group" aria-label="Diet" className="flex shrink-0 gap-2">
          <FilterChip pressed={filters.diet === 'veg'} onClick={() => onChange({ diet: filters.diet === 'veg' ? 'all' : 'veg' })}>
            Veg
          </FilterChip>
          <FilterChip pressed={filters.diet === 'non-veg'} onClick={() => onChange({ diet: filters.diet === 'non-veg' ? 'all' : 'non-veg' })}>
            Non-veg
          </FilterChip>
        </div>
        {divider}
        {hasPawfile ? (
          <FilterChip pressed={filters.safe} onClick={() => onChange({ safe: !filters.safe })}>
            Safe for {petName || 'my pet'}
          </FilterChip>
        ) : (
          <button
            type="button"
            onClick={openPawfile}
            className="inline-flex min-h-10 shrink-0 items-center whitespace-nowrap rounded-full border border-dashed border-field px-4 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-oxblood hover:border-oxblood"
          >
            Safe for my pet · add a Pawfile
          </button>
        )}
        {isFiltered(filters) ? (
          <button
            type="button"
            onClick={() => onChange(DEFAULT_FILTERS)}
            className="min-h-10 shrink-0 whitespace-nowrap px-2 text-sm text-muted underline underline-offset-4 hover:text-oxblood lg:ml-auto"
          >
            Clear filters
          </button>
        ) : null}
      </div>
      {isFiltered(filters) && !disabled ? (
        <p className="mt-2 flex items-center gap-2 px-4 text-sm text-muted sm:px-8 lg:hidden">
          <span>Showing: {describe(filters, petName)}</span>
          <button type="button" onClick={() => onChange(DEFAULT_FILTERS)} className="font-semibold text-oxblood underline underline-offset-4">
            Clear
          </button>
        </p>
      ) : null}
    </div>
  )
}

function describe(f: MenuFilters, petName?: string) {
  const parts: string[] = []
  if (f.category !== 'all') parts.push(CATEGORIES.find((c) => c.id === f.category)!.name)
  if (f.pet !== 'all') parts.push(f.pet === 'dog' ? 'Dog' : 'Cat')
  if (f.diet !== 'all') parts.push(f.diet === 'veg' ? 'Veg' : 'Non-veg')
  if (f.safe) parts.push(`Safe for ${petName || 'my pet'}`)
  return parts.join(' · ')
}
