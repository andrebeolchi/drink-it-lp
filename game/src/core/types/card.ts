import type { MinigameType } from '@/core/types/minigame'

export type CardCategory = 'ACTION' | 'GROUP' | 'GAME' | 'REFLEX' | 'SHOWDOWN' | 'MODIFIER' | 'BENEFIT'

export interface DeckCard {
  id: string
  category: CardCategory
  minigameType: MinigameType
  i18nKey: string
  targetCount?: number
  customTitle?: string
  customBody?: string
}

export type ModifierType = 'RULE_ADD' | 'RULE_REMOVE' | 'LINK_PLAYERS'

export interface ActiveModifier {
  id: string
  type: ModifierType
  sourceCardId: string
  label: string
  linkedPlayerId?: string
  linkedDrinksLeft?: number
  isPermanent: boolean
}
