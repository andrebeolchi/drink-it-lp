import type { ComponentType } from 'react'

import type { DeckCard } from '@/core/types/card'
import type { MinigameType } from '@/core/types/minigame'

export interface CardProps {
  card: DeckCard
  onComplete: () => void
}

export interface CardResolver {
  component: ComponentType<CardProps> | null
  fullScreen: boolean
  requiresTimer: boolean
}

export const CARD_REGISTRY: Record<MinigameType, CardResolver> = {
  DIRECT_TARGET: { component: null, fullScreen: false, requiresTimer: false },
  GROUP_DYNAMIC: { component: null, fullScreen: false, requiresTimer: false },
  SEQUENTIAL_GAME: { component: null, fullScreen: false, requiresTimer: false },
  REFLEX_GAME: { component: null, fullScreen: false, requiresTimer: true },
  SHOWDOWN: { component: null, fullScreen: false, requiresTimer: false },
  MODIFIER: { component: null, fullScreen: false, requiresTimer: false },
  BENEFIT: { component: null, fullScreen: false, requiresTimer: false },
  HOT_POTATO: { component: null, fullScreen: true, requiresTimer: true },
  REVERSO: { component: null, fullScreen: false, requiresTimer: false },
}

export function registerCardComponent(type: MinigameType, component: ComponentType<CardProps>): void {
  CARD_REGISTRY[type].component = component
}
