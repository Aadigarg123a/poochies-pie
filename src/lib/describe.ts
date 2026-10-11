import { FROSTINGS, getFlavour } from '@/data/menu'
import { priceLine, type LineConfig } from './pricing'

export interface LineDescription {
  title: string
  details: string[]
  /** Price lines beyond the base (add-ons, faces). */
  extras: { label: string; amount: number }[]
  base: number
  unitTotal: number
}

/** Human description of a cart line, shared by the bag and the WhatsApp message. */
export function describeLine(config: LineConfig): LineDescription {
  const p = priceLine(config)
  const details: string[] = []
  if (config.kind === 'cake') {
    details.push(`Frosting: ${FROSTINGS.find((f) => f.id === config.frosting)!.name}`)
    if (config.bannerText?.trim()) details.push(`Banner: “${config.bannerText.trim()}”`)
  }
  if (config.kind === 'dognuts' || config.kind === 'cupcakes') {
    details.push(`Flavour: ${getFlavour(config.flavour).name}`)
  }
  return { title: p.base.label, details, extras: p.extras, base: p.base.amount, unitTotal: p.total }
}
