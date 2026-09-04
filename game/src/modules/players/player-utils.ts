import { v4 as uuidv4 } from 'uuid'

import type { AvatarColor, Player } from '@/core/types/player'

const AVATAR_COLOR_CYCLE: AvatarColor[] = [
  'coral',
  'violet',
  'cyan',
  'amber',
  'green',
  'pink',
  'sky',
  'lime',
]

export function getNextAvatarColor(existingPlayers: Player[]): AvatarColor {
  const usedColors = new Set(existingPlayers.map((p) => p.avatarColor))
  return (
    AVATAR_COLOR_CYCLE.find((c) => !usedColors.has(c)) ??
    AVATAR_COLOR_CYCLE[existingPlayers.length % AVATAR_COLOR_CYCLE.length]
  )
}

export function createPlayer({ name, avatarColor }: { name: string; avatarColor: AvatarColor }): Player {
  return {
    id: uuidv4(),
    name: name.trim(),
    avatarColor,
    drinkCount: 0,
    drinkLog: [],
    inventory: {
      shields: 0,
      bathroom: 0,
      salute: 0,
      linkedPlayers: [],
    },
    isActive: true,
  }
}
