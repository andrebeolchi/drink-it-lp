import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { Analytics } from '@/core/analytics'
import type { CardProps } from '@/core/engine/card-registry'
import { useGameStore } from '@/core/store/game-store'

import { CardBase } from '@/components/feature/card-base'
import { PlayerInventoryIcons } from '@/components/feature/player-inventory-icons'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'

export function SequentialGameCard({ card, onComplete }: CardProps) {
  const { t } = useTranslation()
  const allPlayers = useGameStore((s) => s.players)
  const registerDrink = useGameStore((s) => s.registerDrink)
  const players = allPlayers.filter((p) => p.isActive)
  const mountTimeRef = useRef(Date.now())

  function handleLoser(playerId: string) {
    registerDrink({ playerId, cardId: card.id })
    Analytics.minigameCompleted({
      type: card.minigameType,
      duration_ms: Date.now() - mountTimeRef.current,
    })
    onComplete()
  }

  return (
    <CardBase card={card} title={t(`${card.i18nKey}.title`)} description={t(`${card.i18nKey}.description`)} onSkip={onComplete}>
      <div className="mt-2 flex flex-col gap-3">
        <Text className="text-sm font-medium text-muted">{t('card.selectTarget', { ns: 'common' })}</Text>
        <div className="flex flex-col gap-2">
          {players.map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-lg bg-surface-raised px-3 py-2">
              <Avatar name={p.name} avatarColor={p.avatarColor} size="sm" />
              <Text truncate className="flex-1 text-sm text-foreground">
                {p.name}
              </Text>
              <PlayerInventoryIcons inventory={p.inventory} />
              <Button size="sm" variant="danger" className="w-auto" onClick={() => handleLoser(p.id)}>
                {t('card.loser', { ns: 'common' })}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </CardBase>
  )
}
