import type { DeckCard } from '@/core/types/card'
import type { Player } from '@/core/types/player'

export interface GameSession {
  id: string
  sessionDate: number
  startTimestamp: number
  durationMs: number
  playerRanking: Array<{
    id: string
    name: string
    avatarColor: string
    drinkCount: number
  }>
  totalDrinks: number
  cardCount: number
}

export interface GameStats {
  sessionDate: number
  startTimestamp: number
  playerRanking: Player[]
  totalDrinks: number
  mostDrawnCard: { id: string; title: string } | null
  cardCount: number
  durationMs: number
  mostDrawnCardInfo: { card: DeckCard; count: number } | null
}
