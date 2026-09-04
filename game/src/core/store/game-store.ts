import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { Analytics } from '@/core/analytics'
import { applyModifierMiddleware } from '@/core/engine/modifier-middleware'
import { StorageKeys } from '@/core/storage/keys'
import { webStorage } from '@/core/storage/local-storage'
import type { ActiveModifier, DeckCard } from '@/core/types/card'
import type { Player } from '@/core/types/player'

import { useCustomCardsStore } from '@/core/store/custom-cards-store'
import { useSettingsStore } from '@/core/store/settings-store'

import { DECK } from '@/modules/deck/deck'
import { shuffleDeck } from '@/modules/deck/shuffle'
import { saveSession } from '@/modules/history/save-session'

interface RegisterDrinkParams {
  playerId: string
  cardId: string
}

interface LinkPlayersParams {
  drawerId: string
  linkedId: string
}

interface GameState {
  players: Player[]
  deck: DeckCard[]
  discardPile: DeckCard[]
  currentCardIndex: number
  activeModifiers: ActiveModifier[]
  isGameActive: boolean
  startTimestamp: number

  startGame: (params: { players: Player[] }) => void
  drawCard: () => DeckCard | null
  registerDrink: (params: RegisterDrinkParams) => void
  addModifier: (modifier: ActiveModifier) => void
  removeModifier: (modifierId: string) => void
  removeExpiredModifiers: () => void
  linkPlayers: (params: LinkPlayersParams) => void
  addPlayerMidGame: (player: Player) => void
  removePlayerMidGame: (playerId: string) => void
  endGame: () => void
  resetGame: () => void
}

const initialState = {
  players: [],
  deck: [],
  discardPile: [],
  currentCardIndex: -1,
  activeModifiers: [],
  isGameActive: false,
  startTimestamp: 0,
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      startGame: ({ players }) => {
        const { disabledCardIds } = useSettingsStore.getState()
        const { cards: customCards } = useCustomCardsStore.getState()
        const filteredDeck = DECK.filter((c) => !disabledCardIds.includes(c.id))
        const resetPlayers = players.map((p) => ({
          ...p,
          drinkCount: 0,
          drinkLog: [],
          isActive: true,
          inventory: { shields: 0, bathroom: 0, salute: 0, linkedPlayers: [] },
        }))
        set({
          players: resetPlayers,
          deck: shuffleDeck([...filteredDeck, ...customCards]),
          discardPile: [],
          currentCardIndex: -1,
          activeModifiers: [],
          isGameActive: true,
          startTimestamp: Date.now(),
        })
        Analytics.gameStarted({ player_count: players.length })
      },

      drawCard: () => {
        const { currentCardIndex, discardPile } = get()
        let deck = get().deck
        if (deck.length === 0) return null
        let nextIndex = currentCardIndex + 1
        if (nextIndex >= deck.length) {
          deck = shuffleDeck(deck)
          nextIndex = 0
        }
        const card = deck[nextIndex]
        set({
          deck,
          currentCardIndex: nextIndex,
          discardPile: [...discardPile, card],
        })
        Analytics.cardDrawn({ card_id: card.id, category: card.category })
        return card
      },

      registerDrink: ({ playerId, cardId }) => {
        const { players, activeModifiers, startTimestamp, currentCardIndex } = get()
        const player = players.find((p) => p.id === playerId)
        if (!player) return

        const result = applyModifierMiddleware({ playerId, activeModifiers, players })

        const drawer = getCurrentPlayer({ players, currentCardIndex })
        const card = get().deck.find((c) => c.id === cardId) ?? get().discardPile.find((c) => c.id === cardId)
        const logEntry = {
          cardId,
          cardCategory: card?.category ?? 'ACTION',
          timestamp: Date.now() - startTimestamp,
          wasBlocked: result.wasBlocked,
          causedByPlayerId: drawer?.id !== playerId ? drawer?.id : undefined,
        }

        Analytics.drinkRegistered({ card_id: cardId, was_blocked: result.wasBlocked })

        set((state) => ({
          players: state.players.map((p) => {
            if (p.id === playerId) {
              const updatedInventory = result.wasBlocked
                ? { ...p.inventory, shields: p.inventory.shields - 1 }
                : p.inventory
              return {
                ...p,
                drinkCount: result.shouldDrink ? p.drinkCount + 1 : p.drinkCount,
                drinkLog: [...p.drinkLog, logEntry],
                inventory: updatedInventory,
              }
            }

            if (result.linkedPlayerIds.includes(p.id)) {
              return {
                ...p,
                drinkCount: p.drinkCount + 1,
                drinkLog: [...p.drinkLog, { ...logEntry, wasBlocked: false }],
                inventory: {
                  ...p.inventory,
                  linkedPlayers: p.inventory.linkedPlayers.map((link) =>
                    link.playerId === playerId ? { ...link, drinksLeft: link.drinksLeft - 1 } : link
                  ),
                },
              }
            }
            return p
          }),
        }))
      },

      addModifier: (modifier) => set((state) => ({ activeModifiers: [...state.activeModifiers, modifier] })),

      removeModifier: (modifierId) =>
        set((state) => ({
          activeModifiers: state.activeModifiers.filter((m) => m.id !== modifierId),
        })),

      removeExpiredModifiers: () => {
        set((state) => ({
          activeModifiers: state.activeModifiers.filter((m) => m.isPermanent),
        }))
      },

      linkPlayers: ({ drawerId, linkedId }) => {
        set((state) => ({
          players: state.players.map((p) => {
            if (p.id === drawerId) {
              return {
                ...p,
                inventory: {
                  ...p.inventory,
                  linkedPlayers: [...p.inventory.linkedPlayers, { playerId: linkedId, drinksLeft: 3 }],
                },
              }
            }
            if (p.id === linkedId) {
              return {
                ...p,
                inventory: {
                  ...p.inventory,
                  linkedPlayers: [...p.inventory.linkedPlayers, { playerId: drawerId, drinksLeft: 3 }],
                },
              }
            }
            return p
          }),
        }))
      },

      addPlayerMidGame: (player) => {
        set((state) => ({ players: [...state.players, player] }))
      },

      removePlayerMidGame: (playerId) => {
        const activeCount = get().players.filter((p) => p.isActive).length
        if (activeCount <= 2) return
        set((state) => ({
          players: state.players.map((p) => (p.id === playerId ? { ...p, isActive: false } : p)),
        }))
      },

      endGame: () => {
        const { players, discardPile, startTimestamp } = get()
        set({ isGameActive: false })
        const totalDrinks = players.reduce((sum, p) => sum + p.drinkCount, 0)
        Analytics.gameEnded({ player_count: players.length, total_drinks: totalDrinks })
        saveSession({ players, discardPile, startTimestamp })
      },

      resetGame: () => set(initialState),
    }),
    {
      name: StorageKeys.GAME_STATE,
      storage: createJSONStorage(() => webStorage),
    }
  )
)

export function getCurrentPlayer(state: { players: Player[]; currentCardIndex: number }): Player | null {
  const active = state.players.filter((p) => p.isActive)
  if (active.length === 0) return null
  const idx = Math.max(0, state.currentCardIndex) % active.length
  return active[idx]
}
