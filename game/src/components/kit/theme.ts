import type { CardCategory } from '@/core/types/card'
import type { MinigameType } from '@/core/types/minigame'
import type { AvatarColor } from '@/core/types/player'

export const AVATAR_BG_CLASSES: Record<AvatarColor, string> = {
  coral: 'bg-[hsl(4_86%_58%)]',
  violet: 'bg-[hsl(262_80%_62%)]',
  cyan: 'bg-[hsl(199_80%_55%)]',
  amber: 'bg-[hsl(38_92%_56%)]',
  green: 'bg-[hsl(142_60%_45%)]',
  pink: 'bg-[hsl(316_72%_60%)]',
  sky: 'bg-[hsl(210_80%_58%)]',
  lime: 'bg-[hsl(84_68%_48%)]',
}

export const CARD_STRIPE_CLASSES: Record<CardCategory, string> = {
  ACTION: 'bg-card-action',
  GROUP: 'bg-card-group',
  GAME: 'bg-card-game',
  REFLEX: 'bg-card-reflex',
  SHOWDOWN: 'bg-card-showdown',
  MODIFIER: 'bg-card-modifier',
  BENEFIT: 'bg-card-benefit',
}

export const CARD_BORDER_CLASSES: Record<MinigameType, string> = {
  DIRECT_TARGET: 'border-card-action',
  GROUP_DYNAMIC: 'border-card-group',
  SEQUENTIAL_GAME: 'border-card-game',
  REFLEX_GAME: 'border-card-reflex',
  HOT_POTATO: 'border-card-reflex',
  SHOWDOWN: 'border-card-showdown',
  MODIFIER: 'border-card-modifier',
  BENEFIT: 'border-card-benefit',
  REVERSO: 'border-card-action',
}
