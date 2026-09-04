import type { AvatarColor } from '@/core/types/player'

import { cn } from '@/components/ui/cn'

export const AVATAR_CLASSES: Record<AvatarColor, string> = {
  coral: 'bg-[hsl(4_86%_58%)]',
  violet: 'bg-[hsl(262_80%_62%)]',
  cyan: 'bg-[hsl(199_80%_55%)]',
  amber: 'bg-[hsl(38_92%_56%)]',
  green: 'bg-[hsl(142_60%_45%)]',
  pink: 'bg-[hsl(316_72%_60%)]',
  sky: 'bg-[hsl(210_80%_58%)]',
  lime: 'bg-[hsl(84_68%_48%)]',
}

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20',
}

const TEXT_SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: 'text-xs font-bold',
  md: 'text-sm font-bold',
  lg: 'text-lg font-bold',
  xl: 'text-2xl font-bold',
}

interface Props {
  name: string
  avatarColor: AvatarColor
  size?: AvatarSize
  className?: string
}

export function Avatar({ name, avatarColor, size = 'md', className }: Props) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full',
        AVATAR_CLASSES[avatarColor],
        SIZE_CLASSES[size],
        className
      )}
    >
      <span className={cn('text-white', TEXT_SIZE_CLASSES[size])}>{initials}</span>
    </div>
  )
}
