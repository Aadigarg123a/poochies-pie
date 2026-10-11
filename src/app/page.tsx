import { FlavourCarousel } from '@/components/home/FlavourCarousel'
import { Hero } from '@/components/home/Hero'
import { AtelierTeaser, FaqTeaser, HowItWorks, InstagramStrip, PawrtyTeaser } from '@/components/home/HomeSections'
import { PromiseStrip } from '@/components/home/PromiseStrip'

export default function HomePage() {
  return (
    <>
      <Hero />
      <PromiseStrip />
      <FlavourCarousel />
      <AtelierTeaser />
      <PawrtyTeaser />
      <HowItWorks />
      <InstagramStrip />
      <FaqTeaser />
    </>
  )
}
