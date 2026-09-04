import { v4 as uuidv4 } from 'uuid'

import type { DeckCard } from '@/core/types'
import type { ActiveModifier, ModifierType } from '@/core/types/card'

const CARD_MODIFIER_MAP: Record<string, { type: ModifierType; isPermanent: boolean }> = {
  card_add_rule: { type: 'RULE_ADD', isPermanent: true },
  card_remove_rule: { type: 'RULE_REMOVE', isPermanent: false },
}

export function createModifier({ card, label }: { card: DeckCard; label: string }): ActiveModifier {
  const config = CARD_MODIFIER_MAP[card.id] ?? {
    type: 'RULE_ADD' as ModifierType,
    isPermanent: true,
  }
  return {
    id: uuidv4(),
    type: config.type,
    sourceCardId: card.id,
    label,
    isPermanent: config.isPermanent,
  }
}
