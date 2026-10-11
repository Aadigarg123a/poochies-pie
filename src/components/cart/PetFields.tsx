'use client'

import { CheckCard, RadioCards } from '@/components/ui/Choice'
import { TextArea, TextField } from '@/components/ui/Field'
import type { Protein, Species } from '@/data/menu'
import type { PetDetails } from '@/stores/cart'

const PROTEINS: readonly Protein[] = ['chicken', 'mutton', 'fish']

export const EMPTY_PET: PetDetails = { name: '', species: 'dog', allergies: [], allergyNotes: '' }

export function PetFields({
  value,
  onChange,
  nameLabel = 'Pet’s name',
  idPrefix,
}: {
  value: PetDetails
  onChange: (pet: PetDetails) => void
  nameLabel?: string
  idPrefix: string
}) {
  const set = (p: Partial<PetDetails>) => onChange({ ...value, ...p })
  return (
    <div className="space-y-5">
      <TextField label={nameLabel} value={value.name} onChange={(e) => set({ name: e.target.value })} autoComplete="off" />
      <RadioCards<Species>
        legend="Dog or cat?"
        name={`${idPrefix}-species`}
        value={value.species}
        onChange={(species) => set({ species })}
        options={[
          { value: 'dog', label: 'Dog' },
          { value: 'cat', label: 'Cat' },
        ]}
      />
      <fieldset>
        <legend className="mb-3 text-sm font-semibold">Food allergies</legend>
        <div className="grid grid-cols-3 gap-2">
          {PROTEINS.map((p) => (
            <CheckCard
              key={p}
              label={`${p[0].toUpperCase()}${p.slice(1)}`}
              checked={value.allergies.includes(p)}
              onChange={(on) => set({ allergies: on ? [...value.allergies, p] : value.allergies.filter((x) => x !== p) })}
            />
          ))}
        </div>
      </fieldset>
      <TextArea
        label="Other allergies or notes"
        optional
        rows={2}
        value={value.allergyNotes}
        onChange={(e) => set({ allergyNotes: e.target.value })}
      />
    </div>
  )
}
