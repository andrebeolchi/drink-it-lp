import type { DeckCard } from '@/core/types/card'
import type { GameStats } from '@/core/types/game'
import type { Player } from '@/core/types/player'

import i18n from '@/i18n'

interface ComputeStatsParams {
  players: Player[]
  discardPile: DeckCard[]
  startTimestamp: number
  sessionDate: number
}

export function computeGameStats({
  players,
  discardPile,
  startTimestamp,
  sessionDate,
}: ComputeStatsParams): GameStats {
  const playerRanking = [...players].sort((a, b) => b.drinkCount - a.drinkCount)
  const totalDrinks = players.reduce((sum, p) => sum + p.drinkCount, 0)
  const durationMs = Date.now() - startTimestamp

  const cardFrequency = discardPile.reduce<Record<string, number>>((acc, card) => {
    acc[card.id] = (acc[card.id] ?? 0) + 1
    return acc
  }, {})

  let mostDrawnCardInfo: GameStats['mostDrawnCardInfo'] = null
  let maxCount = 0

  for (const card of discardPile) {
    const count = cardFrequency[card.id] ?? 0
    if (count > maxCount) {
      maxCount = count
      mostDrawnCardInfo = { card, count }
    }
  }

  const mostDrawnCard = mostDrawnCardInfo
    ? {
        id: mostDrawnCardInfo.card.id,
        title: i18n.t(`${mostDrawnCardInfo.card.i18nKey}.title`),
      }
    : null

  return {
    sessionDate,
    startTimestamp,
    playerRanking,
    totalDrinks,
    mostDrawnCard,
    cardCount: discardPile.length,
    durationMs,
    mostDrawnCardInfo,
  }
}
