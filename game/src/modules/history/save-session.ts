import { v4 as uuidv4 } from 'uuid'

import { useHistoryStore } from '@/core/store/history-store'
import type { DeckCard } from '@/core/types/card'
import type { GameSession } from '@/core/types/game'
import type { Player } from '@/core/types/player'

interface SaveSessionParams {
  players: Player[]
  discardPile: DeckCard[]
  startTimestamp: number
}

export function saveSession({ players, discardPile, startTimestamp }: SaveSessionParams): void {
  const now = Date.now()
  const durationMs = now - startTimestamp

  const session: GameSession = {
    id: uuidv4(),
    sessionDate: now,
    startTimestamp,
    durationMs,
    playerRanking: [...players]
      .sort((a, b) => b.drinkCount - a.drinkCount)
      .map((p) => ({
        id: p.id,
        name: p.name,
        avatarColor: p.avatarColor,
        drinkCount: p.drinkCount,
      })),
    totalDrinks: players.reduce((sum, p) => sum + p.drinkCount, 0),
    cardCount: discardPile.length,
  }

  useHistoryStore.getState().addSession(session)
}
