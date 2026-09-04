import type { CardCategory } from '@/core/types/card'

export type AvatarColor = 'coral' | 'violet' | 'cyan' | 'amber' | 'green' | 'pink' | 'sky' | 'lime'

export interface DrinkLogEntry {
  cardId: string
  cardCategory: CardCategory
  timestamp: number
  wasBlocked: boolean
  causedByPlayerId?: string
}

export interface LinkedPlayer {
  playerId: string
  drinksLeft: number
}

export interface Player {
  id: string
  name: string
  avatarColor: AvatarColor
  drinkCount: number
  drinkLog: DrinkLogEntry[]
  inventory: {
    shields: number
    bathroom: number
    salute: number
    linkedPlayers: LinkedPlayer[]
  }
  isActive: boolean
}
