'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { CheckCard, RadioCards } from '@/components/ui/Choice'
import { Drawer } from '@/components/ui/Drawer'
import { TextArea, TextField } from '@/components/ui/Field'
import type { Protein, Species } from '@/data/menu'
import { isValidISODate } from '@/lib/dates'
import { usePawfileStore, type BreedSize, type Pawfile } from '@/stores/pawfile'
import { useUIStore } from '@/stores/ui'
import { BirthdayReminderButton } from './BirthdayReminderButton'

const PROTEINS: readonly Protein[] = ['chicken', 'mutton', 'fish']
const EMPTY: Pawfile = { name: '', species: 'dog', breedSize: null, birthday: null, allergies: [], allergyNotes: '' }

export function PawfileSheet() {
  const open = useUIStore((s) => s.pawfileOpen)
  const close = useUIStore((s) => s.closePawfile)
  const saved = usePawfileStore((s) => s.pawfile)
  return (
    <Drawer open={open} onClose={close} title="Pawfile">
      {/* Mounted only while open, so each opening starts from the saved Pawfile. */}
      {open ? <PawfileForm saved={saved} onDone={close} /> : null}
    </Drawer>
  )
}

function PawfileForm({ saved, onDone }: { saved: Pawfile | null; onDone: () => void }) {
  const save = usePawfileStore((s) => s.save)
  const clear = usePawfileStore((s) => s.clear)
  const [draft, setDraft] = useState<Pawfile>(saved ?? EMPTY)
  const [error, setError] = useState<string | null>(null)
  const [justSaved, setJustSaved] = useState(false)
  const set = (p: Partial<Pawfile>) => {
    setJustSaved(false)
    setDraft((d) => ({ ...d, ...p }))
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft.name.trim()) return setError('Add your pet’s name.')
    if (draft.birthday && !isValidISODate(draft.birthday)) return setError('That birthday doesn’t look right.')
    setError(null)
    save(draft)
    setJustSaved(true)
  }

  return (
    <form onSubmit={submit} className="space-y-7" noValidate>
      <p className="text-[0.9375rem] text-muted">
        A little profile of your pet, kept <strong className="font-semibold text-ink">only on this device</strong>. It pre-fills
        your orders and flags anything on the menu that clashes with an allergy.
      </p>
      <TextField label="Pet’s name" value={draft.name} onChange={(e) => set({ name: e.target.value })} error={error?.includes('name') ? error : null} autoComplete="off" />
      <RadioCards<Species>
        legend="Dog or cat?"
        name="pawfile-species"
        value={draft.species}
        onChange={(species) => set({ species })}
        options={[
          { value: 'dog', label: 'Dog' },
          { value: 'cat', label: 'Cat' },
        ]}
      />
      <RadioCards<BreedSize>
        legend="Size"
        name="pawfile-size"
        value={draft.breedSize}
        columns={3}
        onChange={(breedSize) => set({ breedSize })}
        options={[
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' },
        ]}
        hint="Helps us suggest bandana and bow sizes."
      />
      <TextField
        label="Birthday"
        type="date"
        optional
        value={draft.birthday ?? ''}
        onChange={(e) => set({ birthday: e.target.value || null })}
        hint="The year can be a guess."
        error={error?.includes('birthday') ? error : null}
      />
      <fieldset>
        <legend className="mb-3 text-sm font-semibold">Food allergies</legend>
        <div className="grid grid-cols-3 gap-2">
          {PROTEINS.map((p) => (
            <CheckCard
              key={p}
              label={`${p[0].toUpperCase()}${p.slice(1)}`}
              checked={draft.allergies.includes(p)}
              onChange={(on) => set({ allergies: on ? [...draft.allergies, p] : draft.allergies.filter((x) => x !== p) })}
            />
          ))}
        </div>
        <p className="mt-2 text-sm text-muted">We can only flag what our menu names. Always mention every allergy when you order.</p>
      </fieldset>
      <TextArea label="Other allergies or notes" optional rows={2} value={draft.allergyNotes} onChange={(e) => set({ allergyNotes: e.target.value })} />

      <div className="space-y-3">
        <Button type="submit" size="lg" className="w-full">
          Save Pawfile
        </Button>
        {justSaved ? (
          <p role="status" className="text-sm text-veg">
            Saved. <Link href="/menu?safe=1" onClick={onDone} className="font-semibold text-oxblood underline underline-offset-4">See what’s safe for {draft.name.trim()}</Link>
          </p>
        ) : null}
        {saved ? (
          <button
            type="button"
            onClick={() => {
              clear()
              setDraft(EMPTY)
              setJustSaved(false)
            }}
            className="text-sm text-muted underline underline-offset-4 hover:text-oxblood"
          >
            Forget this Pawfile
          </button>
        ) : null}
      </div>

      {saved?.birthday ? <BirthdayReminderButton pawfile={saved} /> : null}
    </form>
  )
}
