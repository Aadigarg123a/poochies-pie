/**
 * Hairline illustration of a two-tier celebration cake on a pedestal, drawn in
 * the brand's oxblood line with blush frosting. Decorative: the hero's text
 * carries the meaning. Replaced by HERO_PHOTO once real photography arrives.
 */
const BOTTOM_DRIP =
  'M82.0 282.0 C86.3 286.4 85.4 311.8 96.2 311.8 C107.0 311.8 106.2 297.1 110.4 292.7 C114.7 295.1 113.9 306.7 124.7 306.7 C135.5 306.7 134.6 298.5 138.9 296.1 C143.2 302.1 142.3 327.2 153.1 327.2 C163.9 327.2 163.1 304.0 167.3 298.0 C171.6 301.2 170.7 314.6 181.6 314.6 C192.4 314.6 191.5 302.1 195.8 298.9 C200.0 304.1 199.2 325.0 210.0 325.0 C220.8 325.0 220.0 304.1 224.2 298.9 C228.5 300.9 227.6 308.6 238.4 308.6 C249.3 308.6 248.4 300.0 252.7 298.0 C256.9 302.8 256.1 321.2 266.9 321.2 C277.7 321.2 276.8 300.9 281.1 296.1 C285.4 298.9 284.5 308.7 295.3 308.7 C306.1 308.7 305.3 295.5 309.6 292.7 C313.8 296.7 313.0 309.8 323.8 309.8 C334.6 309.8 333.7 286.0 338.0 282.0 A128 17 0 0 0 82.0 282.0 Z'
const TOP_DRIP =
  'M126.0 196.0 C129.6 199.2 128.9 218.2 138.0 218.2 C147.1 218.2 146.4 207.6 150.0 204.4 C153.6 209.6 152.9 231.8 162.0 231.8 C171.1 231.8 170.4 212.0 174.0 206.8 C177.6 209.2 176.9 219.5 186.0 219.5 C195.1 219.5 194.4 210.3 198.0 207.9 C201.6 212.3 200.9 230.0 210.0 230.0 C219.1 230.0 218.4 212.3 222.0 207.9 C225.6 210.7 224.9 221.5 234.0 221.5 C243.1 221.5 242.4 209.6 246.0 206.8 C249.6 211.6 248.9 229.8 258.0 229.8 C267.1 229.8 266.4 209.2 270.0 204.4 C273.6 208.0 272.9 220.2 282.0 220.2 C291.1 220.2 290.4 199.6 294.0 196.0 A84 12 0 0 0 126.0 196.0 Z'
const PEARLS: [number, number][] = [
  [138, 284.2], [150, 286.4], [162, 287.8], [174, 288.8], [186, 289.5], [198, 289.9], [210, 290],
  [222, 289.9], [234, 289.5], [246, 288.8], [258, 287.8], [270, 286.4], [282, 284.2],
]
const SPARKLE = 'M0 -7 L1.3 -1.3 7 0 1.3 1.3 0 7 -1.3 1.3 -7 0 -1.3 -1.3Z'

function Bone({ fill, stroke }: { fill: string; stroke?: string }) {
  const s = stroke ? { stroke, strokeWidth: 2.6 } : {}
  return (
    <g fill={fill} {...s}>
      <rect x="184" y="160" width="52" height="12" rx="2" />
      <circle cx="184" cy="159" r="8" />
      <circle cx="184" cy="173" r="8" />
      <circle cx="236" cy="159" r="8" />
      <circle cx="236" cy="173" r="8" />
    </g>
  )
}

export function HeroCake({ className }: { className?: string }) {
  const ink = 'var(--color-oxblood)'
  return (
    <svg viewBox="0 0 420 490" className={className} aria-hidden="true" focusable="false">
      <g fill="none" stroke={ink} strokeWidth="1.25" strokeLinejoin="round" strokeLinecap="round">
        {/* pedestal */}
        <path d="M196 418 C198 440 188 452 172 462 H248 C232 452 222 440 224 418" fill="var(--color-cream)" />
        <ellipse cx="210" cy="466" rx="62" ry="9" fill="var(--color-cream)" />
        <path d="M42 392 v6 A168 20 0 0 0 378 398 v-6" fill="var(--color-linen)" />
        <ellipse cx="210" cy="392" rx="168" ry="20" fill="var(--color-cream)" />

        {/* bottom tier */}
        <path d="M82 282 V380 A128 17 0 0 0 338 380 V282 Z" fill="var(--color-blush-mist)" />
        <ellipse cx="210" cy="282" rx="128" ry="17" fill="var(--color-cream)" />
        <path d={BOTTOM_DRIP} fill="var(--color-cream)" />
        {/* name banner */}
        <path d="M82 330 A128 17 0 0 0 338 330 V352 A128 17 0 0 1 82 352 Z" fill={ink} stroke="none" />
        <path id="hero-banner-arc" d="M90 348 A128 17 0 0 0 330 348" stroke="none" />
        <text fill="var(--color-cream)" stroke="none" fontSize="15" style={{ fontFamily: 'var(--font-pacifico)' }}>
          <textPath href="#hero-banner-arc" startOffset="50%" textAnchor="middle">
            Happy Birthday
          </textPath>
        </text>

        {/* top tier */}
        <path d="M126 196 V278 A84 12 0 0 0 294 278 V196 Z" fill="var(--color-cream)" />
        <ellipse cx="210" cy="196" rx="84" ry="12" fill="var(--color-blush)" />
        <path d={TOP_DRIP} fill="var(--color-blush)" />
        {PEARLS.map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r="2.7" fill="var(--color-cream)" strokeWidth="0.9" />
        ))}

        {/* bone topper (union outline: stroked layer under a filled layer) */}
        <g transform="rotate(-9 210 166)">
          <Bone fill={ink} stroke={ink} />
          <Bone fill="var(--color-cream)" />
        </g>

        {/* sprinkles */}
        <g stroke="none" fill="var(--color-rose)">
          <circle cx="168" cy="193" r="1.6" />
          <circle cx="252" cy="199" r="1.6" />
          <circle cx="196" cy="201" r="1.3" />
          <circle cx="231" cy="192" r="1.3" />
        </g>
      </g>
      <g fill="var(--color-rose)">
        <path d={SPARKLE} transform="translate(92 168) scale(1.1)" />
        <path d={SPARKLE} transform="translate(338 214) scale(0.8)" />
        <path d={SPARKLE} transform="translate(318 120) scale(0.55)" />
        <path d={SPARKLE} transform="translate(120 96) scale(0.5)" />
      </g>
    </svg>
  )
}
