import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DietMark, NeverInIt } from '@/components/ui/Badges'
import { RadioCards } from '@/components/ui/Choice'
import { DatePicker } from '@/components/ui/DatePicker'
import { PriceRow } from '@/components/ui/PriceRow'
import { ProductImage } from '@/components/ui/ProductImage'

describe('DatePicker', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-10-11T04:30:00Z')) // 10:00 in Delhi
  })
  afterEach(() => vi.useRealTimers())

  function Harness({ onPick }: { onPick: (d: string) => void }) {
    const [value, setValue] = useState<string | null>(null)
    return (
      <DatePicker
        value={value}
        onChange={(d) => {
          setValue(d)
          onPick(d)
        }}
      />
    )
  }

  it('rejects today and accepts tomorrow', async () => {
    const onPick = vi.fn()
    render(<Harness onPick={onPick} />)
    const grid = await screen.findByRole('grid')

    const today = within(grid).getByRole('button', { name: /Sunday,? 11 October 2026, today, unavailable/ })
    expect(today).toHaveAttribute('aria-disabled', 'true')
    await userEvent.click(today)
    expect(onPick).not.toHaveBeenCalled()

    const tomorrow = within(grid).getByRole('button', { name: /^Monday,? 12 October 2026$/ })
    expect(tomorrow).not.toHaveAttribute('aria-disabled')
    await userEvent.click(tomorrow)
    expect(onPick).toHaveBeenCalledWith('2026-10-12')
    expect(screen.getByText(/Selected:/)).toHaveTextContent('Mon, 12 Oct 2026')
  })

  it('marks the recommended date and explains the rule', async () => {
    render(<Harness onPick={() => {}} />)
    const grid = await screen.findByRole('grid')
    expect(within(grid).getByRole('button', { name: /13 October 2026, recommended/ })).toBeInTheDocument()
    expect(screen.getByText(/No same-day orders/)).toBeInTheDocument()
  })

  it('supports arrow-key navigation within allowed dates', async () => {
    render(<Harness onPick={() => {}} />)
    const grid = await screen.findByRole('grid')
    const first = within(grid).getByRole('button', { name: /^Monday,? 12 October 2026$/ })
    expect(first).toHaveAttribute('tabindex', '0')
    first.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement).toHaveAttribute('data-date', '2026-10-13')
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}')
    // Clamped at the earliest allowed date.
    expect(document.activeElement).toHaveAttribute('data-date', '2026-10-12')
    await userEvent.keyboard('{Enter}')
    expect(screen.getByText(/Selected:/)).toBeInTheDocument()
  })
})

describe('badges and rows', () => {
  it('DietMark never relies on colour alone', () => {
    render(<DietMark diet="non-veg" />)
    expect(screen.getByText('Non-veg')).toBeInTheDocument()
  })

  it('NeverInIt lists the four promises', () => {
    render(<NeverInIt />)
    const list = screen.getByRole('list', { name: 'Never in it' })
    expect(within(list).getAllByRole('listitem').map((li) => li.textContent)).toEqual([
      'No sugar or fondant',
      'No salt',
      'No cocoa powder',
      'No preservatives',
    ])
  })

  it('PriceRow formats rupees the Indian way', () => {
    render(<PriceRow name="Mutton Delight" price={1250} />)
    expect(screen.getByText('₹1,250')).toBeInTheDocument()
  })

  it('ProductImage falls back to a named placeholder without a photo', () => {
    const { container } = render(<ProductImage slug="crazy-dognuts" name="Crazy Dognuts" />)
    expect(container.querySelector('[data-placeholder]')).toHaveTextContent('Crazy Dognuts')
    expect(container.querySelector('img')).toBeNull()
  })
})

describe('RadioCards', () => {
  it('is a native radio group', async () => {
    const onChange = vi.fn()
    render(
      <RadioCards
        legend="Size"
        name="size"
        value={null}
        onChange={onChange}
        options={[
          { value: 'half-kg', label: 'Half kilo' },
          { value: 'one-kg', label: 'One kilo' },
        ]}
      />,
    )
    expect(screen.getByRole('group', { name: 'Size' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('radio', { name: /One kilo/ }))
    expect(onChange).toHaveBeenCalledWith('one-kg')
  })
})
