'use client'

import { useEffect, useId, useRef, type ReactNode } from 'react'
import { CloseIcon } from './icons'

const FOCUSABLE = 'a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex="-1"])'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  /** Visually hide the title (it is still the dialog's accessible name). */
  hideTitle?: boolean
  side?: 'right' | 'left' | 'bottom'
  children: ReactNode
  footer?: ReactNode
  className?: string
}

/**
 * A modal side sheet built on the native <dialog>: focus is trapped, the page
 * behind is inert, Escape closes it, and focus returns to the opener.
 */
export function Drawer({ open, onClose, title, hideTitle, side = 'right', children, footer, className = '' }: DrawerProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      data-side={side}
      className={`pp-drawer ${className}`}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        // A click on the backdrop lands on the <dialog> element itself.
        if (e.target === e.currentTarget) onClose()
      }}
      onKeyDown={(e) => {
        // Keep Tab cycling inside the sheet instead of escaping to the browser UI.
        if (e.key !== 'Tab') return
        const focusable = [...e.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
          (el) => !el.hasAttribute('disabled') && el.offsetParent !== null,
        )
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-4 border-b hairline px-5 py-4 sm:px-7">
          <h2 id={titleId} className={hideTitle ? 'sr-only' : 'font-display text-2xl text-oxblood'}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-oxblood transition-colors hover:bg-linen"
          >
            <CloseIcon />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7">{children}</div>
        {footer ? <div className="border-t hairline bg-cream px-5 py-4 sm:px-7">{footer}</div> : null}
      </div>
    </dialog>
  )
}
