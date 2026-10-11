import type { StaticImageData } from 'next/image'

/**
 * Real product photography goes here, and only here.
 *
 * To add a photo:
 *   1. Put the original in src/assets/photos/ (JPG/PNG, at least 1600 px wide).
 *   2. import it at the top of this file:  import beer from '@/assets/photos/beer.jpg'
 *   3. Map it below:  'pet-friendly-beer': { src: beer, alt: 'Describe what is in the photo' }
 * next/image serves AVIF/WebP automatically. Until a slug has a photo, the
 * site shows an art-directed placeholder with the item's name.
 *
 * TODO(owner): 10–20 original photos (with permission) and 3 hero picks.
 */
export interface Photo {
  src: StaticImageData
  alt: string
}

export const PHOTOS: Partial<Record<string, Photo>> = {}

/** The home-page hero image. `null` shows the illustrated hero. */
export const HERO_PHOTO: Photo | null = null
