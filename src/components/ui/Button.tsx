import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { ArrowIcon } from './icons'
import { Magnetic } from './Magnetic'

type Variant = 'primary' | 'secondary' | 'ghost' | 'light'
type Size = 'md' | 'lg'

const base =
  'inline-flex select-none items-center justify-center gap-2.5 rounded-[2px] font-sans font-semibold uppercase tracking-[0.16em] transition-[background-color,color,border-color,box-shadow] duration-300 disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary: 'bg-oxblood text-cream hover:bg-oxblood-deep',
  secondary: 'border border-oxblood text-oxblood hover:bg-oxblood hover:text-cream',
  ghost: 'text-oxblood underline decoration-hairline decoration-1 underline-offset-[6px] hover:decoration-oxblood',
  light: 'bg-cream text-oxblood hover:bg-blush-mist',
}

const sizes: Record<Size, string> = {
  md: 'min-h-11 px-5 text-[0.75rem]',
  lg: 'min-h-13 px-7 text-[0.8125rem]',
}

interface CommonProps {
  variant?: Variant
  size?: Size
  /** Gently follows the pointer (fine pointers only; off with reduced motion). */
  magnetic?: boolean
  arrow?: boolean
  className?: string
  children: ReactNode
}

export function buttonClasses({ variant = 'primary', size = 'md', className }: Pick<CommonProps, 'variant' | 'size' | 'className'>) {
  return cn(base, variants[variant], variant !== 'ghost' && sizes[size], variant === 'ghost' && 'min-h-11 text-[0.75rem]', className)
}

function Inner({ children, arrow }: Pick<CommonProps, 'children' | 'arrow'>) {
  return (
    <>
      {children}
      {arrow ? <ArrowIcon size={16} className="transition-transform duration-500 ease-[var(--ease-soft)] group-hover:translate-x-1" /> : null}
    </>
  )
}

export function Button({
  variant,
  size,
  magnetic,
  arrow,
  className,
  children,
  type = 'button',
  ...props
}: CommonProps & Omit<ComponentProps<'button'>, keyof CommonProps>) {
  const el = (
    <button type={type} className={cn('group', buttonClasses({ variant, size, className }))} {...props}>
      <Inner arrow={arrow}>{children}</Inner>
    </button>
  )
  return magnetic ? <Magnetic>{el}</Magnetic> : el
}

export function ButtonLink({
  variant,
  size,
  magnetic,
  arrow,
  className,
  children,
  href,
  ...props
}: CommonProps & Omit<ComponentProps<typeof Link>, keyof CommonProps>) {
  const el = (
    <Link href={href} className={cn('group', buttonClasses({ variant, size, className }))} {...props}>
      <Inner arrow={arrow}>{children}</Inner>
    </Link>
  )
  return magnetic ? <Magnetic>{el}</Magnetic> : el
}

/** For external links (WhatsApp, Instagram). */
export function ButtonAnchor({
  variant,
  size,
  magnetic,
  arrow,
  className,
  children,
  ...props
}: CommonProps & Omit<ComponentProps<'a'>, keyof CommonProps>) {
  const el = (
    <a className={cn('group', buttonClasses({ variant, size, className }))} {...props}>
      <Inner arrow={arrow}>{children}</Inner>
    </a>
  )
  return magnetic ? <Magnetic>{el}</Magnetic> : el
}
