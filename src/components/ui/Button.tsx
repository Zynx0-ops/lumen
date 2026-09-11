import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'accent' | 'neutral' | 'ghost' | 'correct' | 'wrong'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  /** Stretch to the container width — used for the lesson footer action. */
  block?: boolean
  /** `sm` for buttons that sit inside cards and toolbars. */
  size?: 'md' | 'sm'
  children: ReactNode
}

const VARIANTS: Record<Variant, string> = {
  // Accent buttons read their colour from the nearest --accent, so a section's
  // hue flows through to its call to action without extra plumbing.
  accent: 'bg-[var(--accent)] text-black hover:brightness-110',
  neutral: 'bg-raised text-ink hover:bg-[#26262b]',
  ghost: 'bg-transparent text-muted hover:text-ink hover:bg-white/5',
  correct: 'bg-correct text-black hover:brightness-110',
  wrong: 'bg-wrong text-white hover:brightness-110',
}

export function Button({
  variant = 'neutral',
  block = false,
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 font-semibold tracking-tight',
        size === 'sm'
          ? 'rounded-xl px-4 py-2.5 text-[14px]'
          : 'rounded-2xl px-6 py-3.5 text-[15px]',
        'transition-all duration-200 ease-out active:scale-[0.97]',
        'disabled:pointer-events-none disabled:opacity-30',
        VARIANTS[variant],
        block ? 'w-full' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </button>
  )
}
