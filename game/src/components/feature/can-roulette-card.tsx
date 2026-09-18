import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Analytics } from '@/core/analytics'
import type { CardProps } from '@/core/engine/card-registry'
import { getCanRouletteTrigger } from '@/core/engine/games/can-roulette'
import { getCurrentPlayer, useGameStore } from '@/core/store/game-store'
import { useSettingsStore } from '@/core/store/settings-store'

// Silent placeholders — swap for the real sound effects once they land.
import openSoundUrl from '@/components/assets/sounds/can-roulette-open.wav'
import pressSoundUrl from '@/components/assets/sounds/can-roulette-press.wav'
import { CanIllustration } from '@/components/feature/can-illustration'
import { CardBase } from '@/components/feature/card-base'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/components/ui/cn'
import { Text } from '@/components/ui/text'

type Phase = 'idle' | 'playing' | 'popped'

export function CanRouletteCard({ card, onComplete }: CardProps) {
  const { t } = useTranslation()
  const allPlayers = useGameStore((s) => s.players)
  const currentCardIndex = useGameStore((s) => s.currentCardIndex)
  const registerDrink = useGameStore((s) => s.registerDrink)
  const soundEnabled = useSettingsStore((s) => s.soundEnabled)
  const players = allPlayers.filter((p) => p.isActive)

  const mountTimeRef = useRef(Date.now())
  const trigger = useMemo(() => getCanRouletteTrigger(), [])
  const startIndex = useMemo(() => {
    const drawer = getCurrentPlayer({ players: allPlayers, currentCardIndex })
    const idx = players.findIndex((p) => p.id === drawer?.id)
    return idx >= 0 ? idx : 0
  }, [allPlayers, currentCardIndex, players])

  const [phase, setPhase] = useState<Phase>('idle')
  const [pressCount, setPressCount] = useState(0)
  const [loserId, setLoserId] = useState<string | null>(null)
  const [showSafeFeedback, setShowSafeFeedback] = useState(false)
  const safeFeedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const currentPresser = players.length > 0 ? players[(startIndex + pressCount) % players.length] : null

  useEffect(() => {
    return () => {
      if (safeFeedbackTimerRef.current) clearTimeout(safeFeedbackTimerRef.current)
    }
  }, [])

  function playSound(url: string) {
    if (!soundEnabled) return
    new Audio(url).play().catch(() => {})
  }

  function handlePress() {
    if (!currentPresser) return
    const nextCount = pressCount + 1

    if (nextCount === trigger) {
      playSound(openSoundUrl)
      setLoserId(currentPresser.id)
      setPressCount(nextCount)
      setPhase('popped')
      registerDrink({ playerId: currentPresser.id, cardId: card.id })
      Analytics.minigameCompleted({
        type: card.minigameType,
        duration_ms: Date.now() - mountTimeRef.current,
      })
      return
    }

    playSound(pressSoundUrl)
    setPressCount(nextCount)
    setShowSafeFeedback(true)
    if (safeFeedbackTimerRef.current) clearTimeout(safeFeedbackTimerRef.current)
    safeFeedbackTimerRef.current = setTimeout(() => setShowSafeFeedback(false), 900)
  }

  const loser = players.find((p) => p.id === loserId)

  return (
    <CardBase
      card={card}
      title={t(`${card.i18nKey}.title`)}
      description={phase === 'idle' ? t(`${card.i18nKey}.description`) : ''}
      onSkip={phase === 'idle' ? onComplete : undefined}
    >
      {phase === 'idle' && (
        <div className="mt-4 flex flex-col items-center gap-4">
          <CanIllustration state="idle" />
          <Button size="lg" onClick={() => setPhase('playing')}>
            🥫 {t('card.canRouletteStart', { ns: 'common' })}
          </Button>
        </div>
      )}

      {phase === 'playing' && currentPresser && (
        <div className="mt-4 flex flex-col items-center gap-4">
          <CanIllustration key={pressCount} state={showSafeFeedback ? 'pressed' : 'idle'} />
          <div className="flex items-center gap-2 rounded-full bg-surface-raised px-3 py-2">
            <Text className="text-sm text-muted">{t('card.canRouletteTurn', { ns: 'common' })}</Text>
            <Avatar name={currentPresser.name} avatarColor={currentPresser.avatarColor} size="sm" />
            <Text className="text-sm font-semibold text-foreground">{currentPresser.name}</Text>
          </div>
          <Button size="lg" variant="danger" onClick={handlePress}>
            {t('card.canRoulettePress', { ns: 'common' })}
          </Button>
          <Text className={cn('h-4 text-sm font-medium text-success transition-opacity', showSafeFeedback ? 'opacity-100' : 'opacity-0')}>
            {t('card.canRouletteSafe', { ns: 'common' })}
          </Text>
        </div>
      )}

      {phase === 'popped' && loser && (
        <div className="mt-4 flex flex-col items-center gap-4">
          <CanIllustration state="popped" />
          <div className="flex flex-col items-center gap-2 rounded-lg bg-danger/10 p-4">
            <Text className="text-xl font-bold text-danger">💥 {t('card.canRouletteOpened', { ns: 'common' })}</Text>
            <div className="flex items-center gap-2">
              <Avatar name={loser.name} avatarColor={loser.avatarColor} size="sm" />
              <Text className="text-sm font-semibold text-foreground">
                {t('card.canRouletteLoser', { ns: 'common', name: loser.name })}
              </Text>
            </div>
          </div>
          <Button onClick={onComplete}>{t('common.confirm', { ns: 'common' })}</Button>
        </div>
      )}
    </CardBase>
  )
}
