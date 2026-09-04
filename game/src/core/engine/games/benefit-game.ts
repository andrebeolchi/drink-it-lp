import type { DeckCard } from '@/core/types'

export type BenefitType = 'SHIELD' | 'BATHROOM' | 'SALUTE'

const CARD_BENEFIT_MAP: Record<string, BenefitType> = {
  card_shield: 'SHIELD',
  card_bathroom: 'BATHROOM',
  card_salute: 'SALUTE',
}

export function getBenefitType(card: DeckCard): BenefitType {
  return CARD_BENEFIT_MAP[card.id] ?? 'SHIELD'
}
