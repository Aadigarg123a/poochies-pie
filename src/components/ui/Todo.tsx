import type { ReactNode } from 'react'
import { FLAGS } from '@/config/flags'

/**
 * A clearly marked owner placeholder. Previews show the TODO; production
 * (NEXT_PUBLIC_SHOW_TODOS=false) shows `fallback` (or nothing).
 */
export function Todo({ children, fallback = null, inline = false }: { children: ReactNode; fallback?: ReactNode; inline?: boolean }) {
  if (!FLAGS.showTodos) return <>{fallback}</>
  const Tag = inline ? 'span' : 'p'
  return (
    <Tag
      data-todo
      className={`${inline ? 'inline-block' : 'block'} rounded-[2px] border border-dashed border-field bg-cream px-2 py-1 font-sans text-xs leading-snug text-muted`}
    >
      <span className="font-semibold text-rose">TODO(owner):</span> {children}
    </Tag>
  )
}
