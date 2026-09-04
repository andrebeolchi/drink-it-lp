import type { ActiveModifier } from '@/core/types/card'
import type { Player } from '@/core/types/player'

interface MiddlewareParams {
  playerId: string
  activeModifiers: ActiveModifier[]
  players: Player[]
}

interface MiddlewareResult {
  shouldDrink: boolean
  wasBlocked: boolean
  linkedPlayerIds: string[]
}

export function applyModifierMiddleware({ playerId, players }: MiddlewareParams): MiddlewareResult {
  const player = players.find((p) => p.id === playerId)
  if (!player) return { shouldDrink: false, wasBlocked: false, linkedPlayerIds: [] }

  if (player.inventory.shields > 0) {
    return { shouldDrink: false, wasBlocked: true, linkedPlayerIds: [] }
  }

  const linkedPlayerIds = players
    .filter(
      (p) =>
        p.id !== playerId &&
        p.inventory.linkedPlayers.some((link) => link.playerId === playerId && link.drinksLeft > 0)
    )
    .map((p) => p.id)

  return { shouldDrink: true, wasBlocked: false, linkedPlayerIds }
}
