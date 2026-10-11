import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from '@/lib/og'

export const alt = "Plan a dog birthday party with Poochie's Pie"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOg({ eyebrow: 'Pawrty Planner', title: 'Throw a proper', italic: 'pawrty.' })
}
