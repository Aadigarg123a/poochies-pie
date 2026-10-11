import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from '@/lib/og'

export const alt = "Poochie's Pie: haute pâtisserie for pets in Delhi"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOg({ eyebrow: 'Delhi', title: 'Haute pâtisserie', italic: 'for pets.' })
}
