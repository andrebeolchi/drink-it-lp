import type { Player } from '@/core/types/player'

export function pickShowdownPair(players: Player[]): [Player, Player] | null {
  const eligible = players.filter((p) => p.isActive)
  if (eligible.length < 2) return null
  const shuffled = [...eligible].sort(() => Math.random() - 0.5)
  return [shuffled[0], shuffled[1]]
}
