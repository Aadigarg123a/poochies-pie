import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from '@/lib/og'

export const alt = "The Poochie's Pie menu: cakes, Dognuts, cupcakes and treats"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOg({ eyebrow: 'The Menu', title: 'Nine flavours,', italic: 'no sugar.' })
}
