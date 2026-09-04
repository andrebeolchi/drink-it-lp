import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useGameStore } from '@/core/store/game-store'
import { useSettingsStore } from '@/core/store/settings-store'
import type { DeckCard } from '@/core/types/card'

import { DECK } from '@/modules/deck/deck'

import { CardDispatcher } from '@/components/feature/card-dispatcher'
import { ManagePlayersSheet } from '@/components/feature/manage-players-sheet'
import { CARD_STRIPE_CLASSES } from '@/components/kit/theme'
import { Avatar } from '@/components/ui/avatar'
import { CategoryBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/components/ui/cn'
import { Modal } from '@/components/ui/modal'
import { Text } from '@/components/ui/text'

const LANGUAGES = [
  { code: 'pt-BR', label: '🇧🇷' },
  { code: 'en-US', label: '🇺🇸' },
  { code: 'es-ES', label: '🇪🇸' },
] as const

export function Game() {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const players = useGameStore((s) => s.players)
  const activeModifiers = useGameStore((s) => s.activeModifiers)
  const currentCard = useGameStore((s) => s.deck[s.currentCardIndex] ?? null)
  const discardPile = useGameStore((s) => s.discardPile)
  const drawCard = useGameStore((s) => s.drawCard)
  const endGame = useGameStore((s) => s.endGame)
  const registerDrink = useGameStore((s) => s.registerDrink)
  const language = useSettingsStore((s) => s.language)
  const setLanguage = useSettingsStore((s) => s.setLanguage)

  const [cardModalVisible, setCardModalVisible] = useState(false)
  const [inventoryPlayerId, setInventoryPlayerId] = useState<string | null>(null)
  const [saluteSelectMode, setSaluteSelectMode] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [debugVisible, setDebugVisible] = useState(false)
  const [debugCard, setDebugCard] = useState<DeckCard | null>(null)
  const [managePlayersVisible, setManagePlayersVisible] = useState(false)
  const cardCountRef = useRef(0)

  const activePlayers = players.filter((p) => p.isActive)
  const currentIdx = activePlayers.length > 0 ? carouselIndex % activePlayers.length : 0
  const orderedPlayers = [...activePlayers.slice(currentIdx), ...activePlayers.slice(0, currentIdx)]
  const inventoryPlayer = players.find((p) => p.id === inventoryPlayerId) ?? null

  function handleDrawCard() {
    const card = drawCard()
    if (!card) return
    cardCountRef.current += 1
    setCardModalVisible(true)
  }

  function handleEndGame() {
    endGame()
    navigate('/results', { replace: true })
  }

  function handleUseBathroom() {
    if (!inventoryPlayer) return
    useGameStore.setState((state) => ({
      players: state.players.map((p) =>
        p.id !== inventoryPlayer.id ? p : { ...p, inventory: { ...p.inventory, bathroom: p.inventory.bathroom - 1 } }
      ),
    }))
    setInventoryPlayerId(null)
  }

  function handleUseSalute(loserId: string) {
    if (!inventoryPlayer) return
    registerDrink({ playerId: loserId, cardId: 'card_salute' })
    useGameStore.setState((state) => ({
      players: state.players.map((p) =>
        p.id !== inventoryPlayer.id ? p : { ...p, inventory: { ...p.inventory, salute: p.inventory.salute - 1 } }
      ),
    }))
    setSaluteSelectMode(false)
    setInventoryPlayerId(null)
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      {activeModifiers.length > 0 && (
        <div className="border-b border-warning/30 bg-warning/10 px-5 py-2">
          <Text className="text-sm font-medium text-warning">
            {t('game.activeModifiers')}: {activeModifiers.map((m) => m.label).join(' · ')}
          </Text>
        </div>
      )}

      <div className="flex items-center justify-between px-5 pt-4">
        <Text as="h1" className="text-xl font-bold text-foreground">
          {t('game.drawCard')}
        </Text>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setManagePlayersVisible(true)}
            className="rounded-full border border-border px-2.5 py-1"
          >
            <Text className="text-sm">👥</Text>
          </button>
          {LANGUAGES.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => setLanguage(code)}
              className={`rounded-full border px-2.5 py-1 ${language === code ? 'border-brand bg-brand/20' : 'border-border'}`}
            >
              <Text className="text-sm">{label}</Text>
            </button>
          ))}
          {import.meta.env.DEV && (
            <button onClick={() => setDebugVisible(true)} className="rounded-lg p-2 active:opacity-50">
              🐞
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto px-5 py-3">
        {orderedPlayers.map((player, index) => {
          const isCurrent = index === 0
          const hasInventory = player.inventory.shields > 0 || player.inventory.bathroom > 0 || player.inventory.salute > 0
          return (
            <button
              key={player.id}
              onClick={() => hasInventory && setInventoryPlayerId(player.id)}
              className="flex shrink-0 flex-col items-center gap-1"
            >
              {isCurrent ? <Text className="text-xs font-bold text-brand">▼</Text> : <div className="h-4" />}
              <Avatar name={player.name} avatarColor={player.avatarColor} size="md" />
              <Text truncate className={cn('w-16 text-center text-xs font-medium', isCurrent ? 'text-brand' : 'text-muted')}>
                {player.name}
              </Text>
              <Text className={cn('text-lg font-bold', player.drinkCount > 0 ? 'text-accent' : 'text-subtle')}>
                {player.drinkCount}
              </Text>
              <div className="flex h-5 items-center gap-0.5">
                {player.inventory.shields > 0 && (
                  <Text className="text-sm">{player.inventory.shields > 1 ? `${player.inventory.shields}🛡️` : '🛡️'}</Text>
                )}
                {player.inventory.bathroom > 0 && (
                  <Text className="text-sm">{player.inventory.bathroom > 1 ? `${player.inventory.bathroom}🚽` : '🚽'}</Text>
                )}
                {player.inventory.salute > 0 && (
                  <Text className="text-sm">{player.inventory.salute > 1 ? `${player.inventory.salute}🫡` : '🫡'}</Text>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex flex-col gap-4 px-5 pt-6">
        <Button size="lg" onClick={handleDrawCard}>
          {t('game.drawCard')}
        </Button>

        {discardPile.length > 0 && (
          <div>
            <Text className="mb-1.5 text-xs font-medium text-subtle">{t('game.recentCards')}</Text>
            <div className="flex gap-2 overflow-x-auto">
              {[...discardPile]
                .reverse()
                .slice(0, 5)
                .map((card, i) => (
                  <div key={`${card.id}-${i}`} className="shrink-0 rounded-full border border-border bg-surface-raised px-3 py-1">
                    <Text truncate className="text-xs text-muted">
                      {card.customTitle ?? t(`${card.i18nKey}.title`)}
                    </Text>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1" />

      <CardDispatcher
        card={currentCard}
        isVisible={cardModalVisible}
        onComplete={() => {
          setCardModalVisible(false)
          setCarouselIndex((i) => i + 1)
        }}
      />

      <Modal
        isVisible={!!inventoryPlayerId}
        onClose={() => {
          setInventoryPlayerId(null)
          setSaluteSelectMode(false)
        }}
      >
        {inventoryPlayer && (
          <div className="flex flex-col gap-4 p-5">
            <div className="flex items-center gap-3">
              <Avatar name={inventoryPlayer.name} avatarColor={inventoryPlayer.avatarColor} size="md" />
              <Text truncate className="flex-1 text-lg font-bold text-foreground">
                {inventoryPlayer.name}
              </Text>
            </div>

            {!saluteSelectMode ? (
              <>
                {inventoryPlayer.inventory.bathroom > 0 && <Button onClick={handleUseBathroom}>🚽 {t('player.useBathroom')}</Button>}
                {inventoryPlayer.inventory.shields > 0 && (
                  <div className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2">
                    <Text className="text-sm font-medium text-success">
                      🛡️ {inventoryPlayer.inventory.shields}× {t('player.shield')}
                    </Text>
                  </div>
                )}
                {inventoryPlayer.inventory.salute > 0 && (
                  <Button onClick={() => setSaluteSelectMode(true)}>🫡 {t('player.useSalute')}</Button>
                )}
                <Button
                  variant="secondary"
                  onClick={() => {
                    setInventoryPlayerId(null)
                    setSaluteSelectMode(false)
                  }}
                >
                  {t('common.close')}
                </Button>
              </>
            ) : (
              <>
                <Text className="text-sm font-medium text-muted">{t('card.selectTarget')}</Text>
                <div className="flex flex-col gap-2">
                  {activePlayers
                    .filter((p) => p.id !== inventoryPlayer.id)
                    .map((p) => (
                      <div key={p.id} className="flex items-center gap-3 rounded-lg bg-surface-raised px-3 py-2">
                        <Avatar name={p.name} avatarColor={p.avatarColor} size="sm" />
                        <Text truncate className="flex-1 text-sm text-foreground">
                          {p.name}
                        </Text>
                        <Button size="sm" variant="danger" className="w-auto" onClick={() => handleUseSalute(p.id)}>
                          {t('card.loser')}
                        </Button>
                      </div>
                    ))}
                </div>
                <Button variant="secondary" onClick={() => setSaluteSelectMode(false)}>
                  {t('common.cancel')}
                </Button>
              </>
            )}
          </div>
        )}
      </Modal>

      <ManagePlayersSheet isVisible={managePlayersVisible} onClose={() => setManagePlayersVisible(false)} />

      <div className="border-t border-border px-5 py-4">
        <Button variant="danger" onClick={handleEndGame}>
          {t('game.endGame')}
        </Button>
      </div>

      {import.meta.env.DEV && (
        <>
          <CardDispatcher card={debugCard} isVisible={!!debugCard} onComplete={() => setDebugCard(null)} />
          <Modal isVisible={debugVisible} onClose={() => setDebugVisible(false)} variant="bottomSheet">
            <div className="flex flex-col gap-4 px-5 pb-5 pt-5">
              <div className="flex items-center gap-2">
                <Text className="text-base font-semibold text-foreground">🐞 Debug — Cards</Text>
                <div className="flex-1" />
                <Button variant="ghost" size="sm" className="w-auto" onClick={() => setDebugVisible(false)}>
                  {t('common.close')}
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                {DECK.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setDebugVisible(false)
                      setDebugCard(item)
                    }}
                    className="relative flex items-center gap-3 overflow-hidden rounded-xl border border-border bg-surface active:opacity-60"
                  >
                    <div className={`w-1 self-stretch ${CARD_STRIPE_CLASSES[item.category]}`} />
                    <div className="flex-1 py-3 pr-3 text-left">
                      <Text truncate className="text-sm font-semibold text-foreground">
                        {item.customTitle ?? t(`${item.i18nKey}.title`)}
                      </Text>
                      <Text className="text-xs text-subtle">{item.minigameType}</Text>
                    </div>
                    <CategoryBadge category={item.category} className="mr-3" />
                  </button>
                ))}
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  )
}
