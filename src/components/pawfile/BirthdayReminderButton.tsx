'use client'

import { CalendarIcon } from '@/components/ui/icons'
import { SITE } from '@/data/site'
import { formatOrderDate, todayInDelhi } from '@/lib/dates'
import { buildBirthdayICS, daysUntilBirthday, reminderDate } from '@/lib/ics'
import { useClientNow } from '@/lib/useClientNow'
import type { Pawfile } from '@/stores/pawfile'

/** "Remind me before {pet}'s birthday": downloads a yearly .ics reminder. No email, no backend. */
export function BirthdayReminderButton({ pawfile }: { pawfile: Pawfile }) {
  const now = useClientNow()
  if (!pawfile.birthday || !now) return null
  const today = todayInDelhi(now)
  const days = daysUntilBirthday(pawfile.birthday, today)
  const name = pawfile.name || 'your pet'

  const download = () => {
    const ics = buildBirthdayICS({
      petName: pawfile.name,
      birthday: pawfile.birthday!,
      today,
      now: new Date(),
      siteUrl: SITE.url,
      siteName: SITE.name,
    })
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `${(pawfile.name || 'pet').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-birthday-reminder.ics`
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <div className="rounded-[2px] border border-field/50 p-4">
      <p className="text-sm text-ink">
        {days === 0
          ? `It’s ${name}’s birthday today!`
          : days <= 3
            ? `${name}’s birthday is in ${days} day${days === 1 ? '' : 's'}. Order soon: we need 1–2 days’ notice.`
            : `${name}’s birthday is in ${days} days.`}
      </p>
      <button
        type="button"
        onClick={download}
        className="mt-3 inline-flex min-h-11 items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-oxblood underline decoration-hairline underline-offset-[6px] hover:decoration-oxblood"
      >
        <CalendarIcon size={18} /> Remind me before {name}&rsquo;s birthday
      </button>
      <p className="mt-1 text-xs text-muted">
        Adds a yearly calendar reminder 3 days ahead (next: {formatOrderDate(reminderDate(pawfile.birthday, today))}).
      </p>
    </div>
  )
}
