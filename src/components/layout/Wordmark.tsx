/**
 * Typeset wordmark in the menu's script lineage.
 * TODO(owner): replace with the circular logo file once supplied (see OWNER_TODO.md).
 */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-script leading-none text-oxblood ${className}`} translate="no">
      Poochie&rsquo;s Pie
    </span>
  )
}

/** Circular seal: the placeholder for the owner's round logo mark. */
export function Seal({ size = 96, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true" className={className}>
      <defs>
        <path id="seal-arc" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
      </defs>
      <circle cx="60" cy="60" r="58" fill="none" stroke="currentColor" strokeWidth="0.75" />
      <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <text fontSize="8.4" letterSpacing="3.2" fill="currentColor" style={{ fontFamily: 'var(--font-manrope)', fontWeight: 600 }}>
        <textPath href="#seal-arc">HAUTE PÂTISSERIE FOR PETS · MADE TO ORDER · DELHI ·</textPath>
      </text>
      <text
        x="60"
        y="69"
        textAnchor="middle"
        fontSize="30"
        fill="currentColor"
        style={{ fontFamily: 'var(--font-pacifico)' }}
      >
        PP
      </text>
    </svg>
  )
}
