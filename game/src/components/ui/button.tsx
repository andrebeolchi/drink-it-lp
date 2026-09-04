import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/components/ui/cn'

type Variant = 'default' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const VARIANT_CLASSES: Record<Variant, string> = {
  default: 'bg-brand text-brand-foreground',
  secondary: 'bg-surface-raised text-foreground',
  danger: 'bg-danger text-danger-foreground',
  ghost: 'bg-transparent text-foreground',
}

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'px-3 py-2 rounded-md text-sm font-semibold',
  md: 'px-5 py-3 rounded-lg text-base font-semibold',
  lg: 'px-6 py-4 rounded-xl text-lg font-bold',
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

export function Button({
  variant = 'default',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...props
}: Props) {
  const isDisabled = disabled || loading

  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-center justify-center gap-2 font-syne transition-opacity active:opacity-70',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        isDisabled && 'cursor-not-allowed opacity-50',
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        children
      )}
    </button>
  )
}
