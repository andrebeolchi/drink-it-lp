import { CARD_REGISTRY, registerCardComponent } from '@/core/engine/card-registry'
import type { DeckCard } from '@/core/types/card'

import { BenefitCard } from '@/components/feature/benefit-card'
import { DirectTargetCard } from '@/components/feature/direct-target-card'
import { GroupDynamicCard } from '@/components/feature/group-dynamic-card'
import { HotPotatoCard } from '@/components/feature/hot-potato-card'
import { ModifierCard } from '@/components/feature/modifier-card'
import { ReflexGameCard } from '@/components/feature/reflex-game-card'
import { ReversoCard } from '@/components/feature/reverso-card'
import { SequentialGameCard } from '@/components/feature/sequential-game-card'
import { ShowdownCard } from '@/components/feature/showdown-card'

registerCardComponent('DIRECT_TARGET', DirectTargetCard)
registerCardComponent('GROUP_DYNAMIC', GroupDynamicCard)
registerCardComponent('SEQUENTIAL_GAME', SequentialGameCard)
registerCardComponent('REFLEX_GAME', ReflexGameCard)
registerCardComponent('SHOWDOWN', ShowdownCard)
registerCardComponent('MODIFIER', ModifierCard)
registerCardComponent('BENEFIT', BenefitCard)
registerCardComponent('HOT_POTATO', HotPotatoCard)
registerCardComponent('REVERSO', ReversoCard)

interface Props {
  card: DeckCard | null
  isVisible: boolean
  onComplete: () => void
}

export function CardDispatcher({ card, isVisible, onComplete }: Props) {
  if (!card || !isVisible) return null

  const resolver = CARD_REGISTRY[card.minigameType]
  const CardComponent = resolver?.component

  if (!CardComponent) return null

  const content = <CardComponent card={card} onComplete={onComplete} />

  if (resolver.fullScreen) {
    return (
      <div className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center bg-black/80">
        <div className="animate-slide-up w-full max-w-lg rounded-t-2xl bg-background p-5">{content}</div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center bg-black/60">
      <div className="animate-slide-up max-h-[90%] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-background">
        <div className="p-4">{content}</div>
      </div>
    </div>
  )
}
