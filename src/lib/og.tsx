/**
 * Brand-styled Open Graph images (next/og). Fonts are vendored OFL woff
 * files in assets/fonts (next/og cannot read woff2).
 */
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

const font = (file: string) => readFile(join(process.cwd(), 'assets/fonts', file))

// Read once per build worker.
const fonts = Promise.all([
  font('fraunces-latin-400-normal.woff'),
  font('fraunces-latin-300-italic.woff'),
  font('pacifico-latin-400-normal.woff'),
  font('manrope-latin-600-normal.woff'),
])

const C = {
  oxblood: '#722a1e',
  deep: '#5c2118',
  cream: '#fdf8f2',
  blush: '#f7b7a3',
  mist: '#fbe3da',
  rose: '#9a4a3b',
}

export async function renderOg({ eyebrow, title, italic, footer }: { eyebrow: string; title: string; italic?: string; footer?: string }) {
  const [fraunces, frauncesItalic, pacifico, manrope] = await fonts
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: C.cream,
          position: 'relative',
          fontFamily: 'Fraunces',
          color: C.oxblood,
        }}
      >
        {/* blush brush stroke */}
        <div
          style={{
            position: 'absolute',
            right: -120,
            top: 250,
            width: 760,
            height: 120,
            background: C.blush,
            borderRadius: 120,
            transform: 'rotate(-6deg)',
            opacity: 0.85,
          }}
        />
        <div style={{ position: 'absolute', top: 28, left: 28, right: 28, bottom: 28, border: `1.5px solid ${C.oxblood}`, opacity: 0.25, display: 'flex' }} />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '72px 84px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: 'Pacifico', fontSize: 52, color: C.oxblood }}>Poochie’s Pie</div>
            <div style={{ fontFamily: 'Manrope', fontSize: 20, letterSpacing: 5, color: C.rose, textTransform: 'uppercase' }}>{eyebrow}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 900 }}>
            <div style={{ fontSize: 88, lineHeight: 1.02, letterSpacing: -1.5, display: 'flex' }}>{title}</div>
            {italic ? (
              <div style={{ fontFamily: 'Fraunces Italic', fontSize: 64, lineHeight: 1.1, color: C.rose, marginTop: 8, display: 'flex' }}>{italic}</div>
            ) : null}
          </div>
          <div style={{ fontFamily: 'Manrope', fontSize: 22, letterSpacing: 2, color: C.deep, display: 'flex' }}>
            {footer ?? 'No sugar · No salt · No cocoa · No preservatives · Delhi'}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: 'Fraunces', data: fraunces, weight: 400, style: 'normal' },
        { name: 'Fraunces Italic', data: frauncesItalic, weight: 300, style: 'italic' },
        { name: 'Pacifico', data: pacifico, weight: 400, style: 'normal' },
        { name: 'Manrope', data: manrope, weight: 600, style: 'normal' },
      ],
    },
  )
}
