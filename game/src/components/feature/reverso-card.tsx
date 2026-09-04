import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { Analytics } from '@/core/analytics'
import type { CardProps } from '@/core/engine/card-registry'
import { getCurrentPlayer, useGameStore } from '@/core/store/game-store'

import { CardBase } from '@/components/feature/card-base'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'

export function ReversoCard({ card, onComplete }: CardProps) {
  const { t } = useTranslation()
  const mountTimeRef = useRef(Date.now())
  const players = useGameStore((s) => s.players)
  const currentCardIndex = useGameStore((s) => s.currentCardIndex)
  const registerDrink = useGameStore((s) => s.registerDrink)

  const drawer = getCurrentPlayer({ players, currentCardIndex })

  const lastCauserId = drawer?.drinkLog
    .slice()
    .reverse()
    .find((entry) => !entry.wasBlocked && entry.causedByPlayerId)?.causedByPlayerId

  const target = lastCauserId ? (players.find((p) => p.id === lastCauserId) ?? drawer) : drawer

  const isSelf = !lastCauserId || target?.id === drawer?.id

  function handleDrink() {
    if (!target) return
    registerDrink({ playerId: target.id, cardId: card.id })
    Analytics.minigameCompleted({
      type: card.minigameType,
      duration_ms: Date.now() - mountTimeRef.current,
    })
    onComplete()
  }

  return (
    <CardBase card={card} title={t(`${card.i18nKey}.title`)} description={t(`${card.i18nKey}.description`)} onSkip={onComplete}>
      <div className="mt-3 flex flex-col gap-3">
        {isSelf ? (
          <div className="flex items-center justify-center rounded-lg bg-warning/10 px-4 py-3">
            <Text className="text-center text-sm font-medium text-warning">{t('card.reversoSelf', { ns: 'common' })}</Text>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-lg bg-danger/10 px-4 py-3">
            <Text className="text-xs font-medium text-muted">{t('card.reversoTarget', { ns: 'common' })}</Text>
            {target && (
              <div className="flex items-center gap-3">
                <Avatar name={target.name} avatarColor={target.avatarColor} size="md" />
                <Text className="font-syne text-lg text-foreground">{target.name}</Text>
              </div>
            )}
          </div>
        )}

        <Button variant="danger" onClick={handleDrink}>
          {t('card.drink', { ns: 'common' })}
        </Button>
      </div>
    </CardBase>
  )
}
