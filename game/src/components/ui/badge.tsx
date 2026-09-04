import { useTranslation } from 'react-i18next'

import type { CardCategory } from '@/core/types/card'

import { cn } from '@/components/ui/cn'

const CATEGORY_CLASSES: Record<CardCategory, { bg: string; text: string; key: string }> = {
  ACTION: { bg: 'bg-card-action/20', text: 'text-card-action', key: 'card.categoryAction' },
  GROUP: { bg: 'bg-card-group/20', text: 'text-card-group', key: 'card.categoryGroup' },
  GAME: { bg: 'bg-card-game/20', text: 'text-card-game', key: 'card.categoryGame' },
  REFLEX: { bg: 'bg-card-reflex/20', text: 'text-card-reflex', key: 'card.categoryReflex' },
  SHOWDOWN: { bg: 'bg-card-showdown/20', text: 'text-card-showdown', key: 'card.categoryShowdown' },
  MODIFIER: { bg: 'bg-card-modifier/20', text: 'text-card-modifier', key: 'card.categoryModifier' },
  BENEFIT: { bg: 'bg-card-benefit/20', text: 'text-card-benefit', key: 'card.categoryBenefit' },
}

interface Props {
  category: CardCategory
  className?: string
}

export function CategoryBadge({ category, className }: Props) {
  const { t } = useTranslation('common')
  const { bg, text, key } = CATEGORY_CLASSES[category]
  return (
    <span className={cn('inline-block rounded-full px-2 py-0.5', bg, className)}>
      <span className={cn('text-xs font-medium uppercase tracking-widest', text)}>{t(key)}</span>
    </span>
  )
}
