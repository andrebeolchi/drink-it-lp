import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Analytics } from '@/core/analytics'
import type { CardProps } from '@/core/engine/card-registry'
import { getCurrentPlayer, useGameStore } from '@/core/store/game-store'

import { CardBase } from '@/components/feature/card-base'
import { PlayerInventoryIcons } from '@/components/feature/player-inventory-icons'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/components/ui/cn'
import { Text } from '@/components/ui/text'

export function GroupDynamicCard({ card, onComplete }: CardProps) {
  const { t } = useTranslation()
  const mountTimeRef = useRef(Date.now())

  if (card.id === 'card_never_have_i') {
    return <NeverHaveICard card={card} onComplete={onComplete} />
  }

  if (card.id === 'card_putinha') {
    return <PutinhaCard card={card} onComplete={onComplete} />
  }

  function handleDone() {
    Analytics.minigameCompleted({
      type: card.minigameType,
      duration_ms: Date.now() - mountTimeRef.current,
    })
    onComplete()
  }

  return (
    <CardBase card={card} title={t(`${card.i18nKey}.title`)} description={t(`${card.i18nKey}.description`)} onSkip={onComplete}>
      <div className="mt-2">
        <Button onClick={handleDone}>{t('card.done', { ns: 'common' })}</Button>
      </div>
    </CardBase>
  )
}

function NeverHaveICard({ card, onComplete }: CardProps) {
  const { t } = useTranslation()
  const players = useGameStore((s) => s.players)
  const registerDrink = useGameStore((s) => s.registerDrink)
  const activePlayers = players.filter((p) => p.isActive)
  const mountTimeRef = useRef(Date.now())

  const [selected, setSelected] = useState<Set<string>>(new Set())

  function togglePlayer(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
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
      </div>
      <div className="mt-3">
        <Button onClick={handleConfirm}>{t('common.confirm', { ns: 'common' })}</Button>
      </div>
    </CardBase>
  )
}

function PutinhaCard({ card, onComplete }: CardProps) {
  const { t } = useTranslation()
  const players = useGameStore((s) => s.players)
  const currentCardIndex = useGameStore((s) => s.currentCardIndex)
  const linkPlayers = useGameStore((s) => s.linkPlayers)
  const activePlayers = players.filter((p) => p.isActive)
  const drawer = getCurrentPlayer({ players, currentCardIndex })
  const mountTimeRef = useRef(Date.now())

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [linkedName, setLinkedName] = useState<string | null>(null)

  function handleConfirm() {
    if (!selectedId || !drawer) return
    const linked = players.find((p) => p.id === selectedId)
    if (!linked) return
    linkPlayers({ drawerId: drawer.id, linkedId: selectedId })
    setLinkedName(linked.name)
    setConfirmed(true)
  }

  function handleDone() {
    Analytics.minigameCompleted({
      type: card.minigameType,
      duration_ms: Date.now() - mountTimeRef.current,
    })
    onComplete()
  }

  return (
    <CardBase card={card} title={t(`${card.i18nKey}.title`)} description={t(`${card.i18nKey}.description`)} onSkip={onComplete}>
      {!confirmed ? (
        <>
          <div className="mt-2 flex flex-col gap-2">
            <Text className="text-sm font-medium text-muted">{t('card.linkPlayer', { ns: 'common' })}</Text>
            {activePlayers
              .filter((p) => p.id !== drawer?.id)
              .map((player) => {
                const isSelected = selectedId === player.id
                return (
                  <button
                    key={player.id}
                    onClick={() => setSelectedId(player.id)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg border px-3 py-2',
                      isSelected ? 'border-brand bg-brand/10' : 'border-border bg-surface-raised'
                    )}
                  >
                    <Avatar name={player.name} avatarColor={player.avatarColor} size="sm" />
                    <Text truncate className="flex-1 text-left text-sm font-medium text-foreground">
                      {player.name}
                    </Text>
                    {isSelected && <Text className="text-sm font-bold text-brand">✓</Text>}
                  </button>
                )
              })}
          </div>
          <div className="mt-2">
            <Button disabled={!selectedId} onClick={handleConfirm}>
              {t('common.confirm', { ns: 'common' })}
            </Button>
          </div>
        </>
      ) : (
        <div className="mt-3 flex flex-col gap-3">
          <div className="flex items-center justify-center rounded-lg border border-success/20 bg-success/10 p-4">
            <Text className="text-center text-base font-bold text-success">
              {t('card.putinhaConfirmed', { ns: 'common', drawer: drawer?.name, linked: linkedName })}
            </Text>
          </div>
          <Button onClick={handleDone}>{t('card.done', { ns: 'common' })}</Button>
        </div>
      )}
    </CardBase>
  )
}
