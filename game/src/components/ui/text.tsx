import type { ElementType, HTMLAttributes } from 'react'

import { cn } from '@/components/ui/cn'

interface Props extends HTMLAttributes<HTMLElement> {
  className?: string
  truncate?: boolean
  as?: ElementType
}

export function Text({ className, truncate, as: Component = 'span', ...props }: Props) {
  return <Component className={cn('text-foreground', truncate && 'truncate', className)} {...props} />
}
