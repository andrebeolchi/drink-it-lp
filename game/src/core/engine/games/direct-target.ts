import type { Player } from '@/core/types/player'

export function pickRandomTarget(players: Player[], excludeId?: string): Player | null {
  const eligible = players.filter((p) => p.isActive && p.id !== excludeId)
  if (eligible.length === 0) return null
  return eligible[Math.floor(Math.random() * eligible.length)]
}

export function pickMultipleTargets({
  players,
  count,
  excludeId,
}: {
  players: Player[]
  count: number
  excludeId?: string
}): Player[] {
  const eligible = players.filter((p) => p.isActive && p.id !== excludeId)
  const shuffled = [...eligible].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}
