import { useTranslation } from 'react-i18next'

import type { CardProps } from '@/core/engine/card-registry'
import { getBenefitType } from '@/core/engine/games/benefit-game'
import { getCurrentPlayer, useGameStore } from '@/core/store/game-store'

import { CardBase } from '@/components/feature/card-base'
import { Button } from '@/components/ui/button'

export function BenefitCard({ card, onComplete }: CardProps) {
  const { t } = useTranslation()
  const players = useGameStore((s) => s.players)
  const currentCardIndex = useGameStore((s) => s.currentCardIndex)
  const drawer = getCurrentPlayer({ players, currentCardIndex })
  const benefitType = getBenefitType(card)

  function handleConfirm() {
    if (!drawer) return
    useGameStore.setState((state) => ({
      players: state.players.map((p) => {
        if (p.id !== drawer.id) return p
        if (benefitType === 'SHIELD') {
          return { ...p, inventory: { ...p.inventory, shields: p.inventory.shields + 1 } }
        }
        if (benefitType === 'BATHROOM') {
          return { ...p, inventory: { ...p.inventory, bathroom: p.inventory.bathroom + 1 } }
        }
        if (benefitType === 'SALUTE') {
          return { ...p, inventory: { ...p.inventory, salute: p.inventory.salute + 1 } }
        }
        return p
      }),
    }))
    onComplete()
  }

  return (
    <CardBase card={card} title={t(`${card.i18nKey}.title`)} description={t(`${card.i18nKey}.description`)} onSkip={onComplete}>
      <div className="mt-2">
        <Button onClick={handleConfirm}>{t('common.confirm', { ns: 'common' })}</Button>
      </div>
    </CardBase>
  )
}
