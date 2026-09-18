import { Check } from 'lucide-react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Analytics } from '@/core/analytics'
import type { CardProps } from '@/core/engine/card-registry'
import { useGameStore } from '@/core/store/game-store'

import { CardBase } from '@/components/feature/card-base'
import { PlayerInventoryIcons } from '@/components/feature/player-inventory-icons'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/components/ui/cn'
import { Text } from '@/components/ui/text'

export function DirectTargetCard({ card, onComplete }: CardProps) {
  const { t } = useTranslation()
  const players = useGameStore((s) => s.players)
  const registerDrink = useGameStore((s) => s.registerDrink)
  const activePlayers = players.filter((p) => p.isActive)
  const maxTargets = card.targetCount
  const mountTimeRef = useRef(Date.now())

  const [selected, setSelected] = useState<Set<string>>(new Set())

  function togglePlayer(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else if (maxTargets === undefined || next.size < maxTargets) {
        next.add(id)
      }
      return next
    })
  }

  function handleConfirm() {
    for (const playerId of selected) {
      registerDrink({ playerId, cardId: card.id })
    }
    Analytics.minigameCompleted({
      type: card.minigameType,
      duration_ms: Date.now() - mountTimeRef.current,
    })
    onComplete()
  }

  const title = card.customTitle ?? t(`${card.i18nKey}.title`)
  const description = card.customBody ?? t(`${card.i18nKey}.description`)

  return (
    <CardBase card={card} title={title} description={description} onSkip={onComplete}>
      <div className="mt-2 flex flex-col gap-2">
        <Text className="text-sm font-medium text-muted">{t('card.selectTarget', { ns: 'common' })}</Text>
        {activePlayers.map((player) => {
          const isSelected = selected.has(player.id)
          return (
            <button
              key={player.id}
              onClick={() => togglePlayer(player.id)}
              className={cn(
                'flex items-center gap-3 rounded-lg border px-3 py-2',
                isSelected ? 'border-brand bg-brand/10' : 'border-border bg-surface-raised'
              )}
            >
              <Avatar name={player.name} avatarColor={player.avatarColor} size="sm" />
              <Text truncate className="flex-1 text-left text-sm font-medium text-foreground">
                {player.name}
              </Text>
              <PlayerInventoryIcons inventory={player.inventory} />
              {isSelected && <Check className="h-4 w-4 text-brand" />}
            </button>
          )
        })}
      </div>
      <div className="mt-3">
        <Button disabled={selected.size === 0} onClick={handleConfirm}>
          {t('common.confirm', { ns: 'common' })}
        </Button>
      </div>
    </CardBase>
  )
}
