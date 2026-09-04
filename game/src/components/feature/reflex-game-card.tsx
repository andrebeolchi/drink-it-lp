import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Analytics } from '@/core/analytics'
import type { CardProps } from '@/core/engine/card-registry'
import { useGameStore } from '@/core/store/game-store'

import { CardBase } from '@/components/feature/card-base'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'

export function ReflexGameCard({ card, onComplete }: CardProps) {
  const { t } = useTranslation()
  const allPlayers = useGameStore((s) => s.players)
  const registerDrink = useGameStore((s) => s.registerDrink)
  const players = allPlayers.filter((p) => p.isActive)
  const mountTimeRef = useRef(Date.now())
  const [tapOrder, setTapOrder] = useState<string[]>([])
  const [finished, setFinished] = useState(false)

  function handleTap(playerId: string) {
    if (tapOrder.includes(playerId)) return
    const updated = [...tapOrder, playerId]
    setTapOrder(updated)
    if (updated.length === players.length) {
      const loserId = updated[updated.length - 1]
      registerDrink({ playerId: loserId, cardId: card.id })
      Analytics.minigameCompleted({
        type: card.minigameType,
        duration_ms: Date.now() - mountTimeRef.current,
      })
      setFinished(true)
    }
  }

  return (
    <CardBase card={card} title={t(`${card.i18nKey}.title`)} description={t(`${card.i18nKey}.description`)} onSkip={onComplete}>
      <div className="mt-2 flex flex-col gap-3">
        {!finished ? (
          <>
            <Text className="text-sm text-muted">{t('card.selectTarget', { ns: 'common' })}</Text>
            <div className="flex flex-col gap-2">
              {players.map((p) => {
                const tapped = tapOrder.includes(p.id)
                return (
                  <div key={p.id} className="flex items-center gap-3 rounded-lg bg-surface-raised px-3 py-2">
                    <Avatar name={p.name} avatarColor={p.avatarColor} size="sm" />
                    <Text truncate className="flex-1 text-sm text-foreground">
                      {p.name}
                    </Text>
                    {!tapped && (
                      <div className="flex gap-1">
                        {p.inventory.shields > 0 && (
                          <span className="rounded-full border border-success/20 bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
                            {t('player.shield', { ns: 'common' })}
                          </span>
                        )}
                        {p.inventory.bathroom > 0 && (
                          <span className="rounded-full border border-brand/20 bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                            {t('player.bathroom', { ns: 'common' })}
                          </span>
                        )}
                      </div>
                    )}
                    <Button
                      size="sm"
                      className="w-auto"
                      variant={tapped ? 'secondary' : 'default'}
                      disabled={tapped}
                      onClick={() => handleTap(p.id)}
                    >
                      {tapped ? `#${tapOrder.indexOf(p.id) + 1}` : 'Tap!'}
                    </Button>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <Button onClick={onComplete}>{t('card.done', { ns: 'common' })}</Button>
        )}
      </div>
    </CardBase>
  )
}
