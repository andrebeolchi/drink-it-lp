import { Bomb, Check, Flame } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Analytics } from '@/core/analytics'
import type { CardProps } from '@/core/engine/card-registry'
import { getHotPotatoTimer } from '@/core/engine/games/hot-potato'
import { useGameStore } from '@/core/store/game-store'
import { useSettingsStore } from '@/core/store/settings-store'

import boomSoundUrl from '@/components/assets/sounds/hot-potato-boom.mp3'
import tickSoundUrl from '@/components/assets/sounds/hot-potato-tick.mp3'
import { CardBase } from '@/components/feature/card-base'
import { PlayerInventoryIcons } from '@/components/feature/player-inventory-icons'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/components/ui/cn'
import { Text } from '@/components/ui/text'

type Phase = 'idle' | 'playing' | 'exploded'

export function HotPotatoCard({ card, onComplete }: CardProps) {
  const { t } = useTranslation()
  const allPlayers = useGameStore((s) => s.players)
  const registerDrink = useGameStore((s) => s.registerDrink)
  const players = allPlayers.filter((p) => p.isActive)
  const soundEnabled = useSettingsStore((s) => s.soundEnabled)

  const mountTimeRef = useRef(Date.now())
  const [phase, setPhase] = useState<Phase>('idle')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tickAudioRef = useRef<HTMLAudioElement | null>(null)
  const boomAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      tickAudioRef.current?.pause()
      boomAudioRef.current?.pause()
    }
  }, [])

  function handleStart() {
    const tick = new Audio(tickSoundUrl)
    const boom = new Audio(boomSoundUrl)
    tick.loop = true
    tickAudioRef.current = tick
    boomAudioRef.current = boom

    if (soundEnabled) {
      tick.play().catch(() => {})
    }

    setPhase('playing')

    timerRef.current = setTimeout(() => {
      tick.pause()
      if (soundEnabled) boom.play().catch(() => {})
      setPhase('exploded')
    }, getHotPotatoTimer())
  }

  function handleConfirm() {
    if (!selectedId) return
    registerDrink({ playerId: selectedId, cardId: card.id })
    Analytics.minigameCompleted({
      type: card.minigameType,
      duration_ms: Date.now() - mountTimeRef.current,
    })
    onComplete()
  }

  return (
    <CardBase
      card={card}
      title={t(`${card.i18nKey}.title`)}
      description={phase === 'exploded' ? '' : t(`${card.i18nKey}.description`)}
      onSkip={onComplete}
    >
      {phase === 'idle' && (
        <div className="mt-4">
          <Button size="lg" onClick={handleStart}>
            <Flame className="h-5 w-5" /> {t('card.startTimer', { ns: 'common' })}
          </Button>
        </div>
      )}

      {phase === 'playing' && (
        <div className="mt-4 flex flex-col items-center gap-3 rounded-lg bg-warning/10 p-4">
          <Flame className="h-10 w-10 text-warning" />
          <Text className="text-sm font-semibold text-warning">{t('card.potatoRunning', { ns: 'common' })}</Text>
        </div>
      )}

      {phase === 'exploded' && (
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex items-center justify-center gap-2 rounded-lg bg-danger/10 p-3">
            <Bomb className="h-6 w-6 text-danger" />
            <Text className="text-2xl font-bold text-danger">{t('card.exploded', { ns: 'common' })}</Text>
          </div>
          <Text className="text-sm font-medium text-muted">{t('card.whoHadPotato', { ns: 'common' })}</Text>
          <div className="flex max-h-56 flex-col gap-2 overflow-y-auto">
            {players.map((player) => {
              const isSelected = selectedId === player.id
              return (
                <button
                  key={player.id}
                  onClick={() => setSelectedId(player.id)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border px-3 py-2',
                    isSelected ? 'border-danger bg-danger/10' : 'border-border bg-surface-raised'
                  )}
                >
                  <Avatar name={player.name} avatarColor={player.avatarColor} size="sm" />
                  <Text truncate className="flex-1 text-left text-sm font-medium text-foreground">
                    {player.name}
                  </Text>
                  <PlayerInventoryIcons inventory={player.inventory} />
                  {isSelected && <Check className="h-4 w-4 text-danger" />}
                </button>
              )
            })}
          </div>
          <div className="mt-1">
            <Button disabled={!selectedId} onClick={handleConfirm}>
              {t('common.confirm', { ns: 'common' })}
            </Button>
          </div>
        </div>
      )}
    </CardBase>
  )
}
