import { useEffect, useRef, useState } from 'react'
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

type EyePhase = 'ready' | 'countdown' | 'select'

export function ShowdownCard({ card, onComplete }: CardProps) {
  if (card.id === 'card_jokenpo') {
    return <JokenpoCard card={card} onComplete={onComplete} />
  }
  return <EyeToEyeCard card={card} onComplete={onComplete} />
}

function EyeToEyeCard({ card, onComplete }: CardProps) {
  const { t } = useTranslation()
  const players = useGameStore((s) => s.players)
  const registerDrink = useGameStore((s) => s.registerDrink)
  const activePlayers = players.filter((p) => p.isActive)
  const mountTimeRef = useRef(Date.now())

  const [phase, setPhase] = useState<EyePhase>('ready')
  const [count, setCount] = useState(3)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (phase !== 'countdown') return
    if (count === 0) {
      const timer = setTimeout(() => setPhase('select'), 600)
      return () => clearTimeout(timer)
    }
    const timer = setTimeout(() => setCount((c) => c - 1), 900)
    return () => clearTimeout(timer)
  }, [phase, count])

  function togglePlayer(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else if (next.size < 2) {
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

  return (
    <CardBase card={card} title={t(`${card.i18nKey}.title`)} description={t(`${card.i18nKey}.description`)} onSkip={onComplete}>
      {phase === 'ready' && (
        <div className="mt-2 flex flex-col gap-3">
          <div className="flex items-center justify-center rounded-lg bg-surface-raised p-4">
            <Text className="text-center text-base font-medium text-foreground">{t('card.lookDown', { ns: 'common' })}</Text>
          </div>
          <Button
            onClick={() => {
              setCount(3)
              setPhase('countdown')
            }}
          >
            {t('card.start', { ns: 'common' })}
          </Button>
        </div>
      )}

      {phase === 'countdown' && (
        <div className="mt-2 flex items-center justify-center py-6">
          <Text className={cn('font-bold', count === 0 ? 'text-4xl text-success' : 'text-6xl text-accent')}>
            {count === 0 ? t('card.lookUp', { ns: 'common' }) : count}
          </Text>
        </div>
      )}

      {phase === 'select' && (
        <div className="mt-2 flex flex-col gap-2">
          <Text className="text-sm font-medium text-muted">{t('card.whoDrank', { ns: 'common' })}</Text>
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
                {isSelected && <Text className="text-sm font-bold text-brand">✓</Text>}
              </button>
            )
          })}
          <div className="mt-1">
            <Button onClick={handleConfirm}>{t('common.confirm', { ns: 'common' })}</Button>
          </div>
        </div>
      )}
    </CardBase>
  )
}

function JokenpoCard({ card, onComplete }: CardProps) {
  const { t } = useTranslation()
  const players = useGameStore((s) => s.players)
  const registerDrink = useGameStore((s) => s.registerDrink)
  const activePlayers = players.filter((p) => p.isActive)
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
        <div className="flex items-center justify-center rounded-lg bg-surface-raised p-3">
          <Text className="text-sm font-semibold text-foreground">{t('card.rpsInstruction', { ns: 'common' })}</Text>
        </div>
        <Text className="text-sm font-medium text-muted">{t('card.selectTarget', { ns: 'common' })}</Text>
        <div className="flex flex-col gap-2">
          {activePlayers.map((player) => (
            <div key={player.id} className="flex items-center gap-3 rounded-lg bg-surface-raised px-3 py-2">
              <Avatar name={player.name} avatarColor={player.avatarColor} size="sm" />
              <Text truncate className="flex-1 text-sm font-medium text-foreground">
                {player.name}
              </Text>
              <PlayerInventoryIcons inventory={player.inventory} />
              <Button size="sm" variant="danger" className="w-auto" onClick={() => handleLoser(player.id)}>
                {t('card.loser', { ns: 'common' })}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </CardBase>
  )
}
