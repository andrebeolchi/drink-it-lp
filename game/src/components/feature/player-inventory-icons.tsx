import type { Player } from '@/core/types/player'

export function PlayerInventoryIcons({ inventory }: { inventory: Player['inventory'] }) {
  if (inventory.shields === 0 && inventory.bathroom === 0 && inventory.salute === 0) return null

  return (
    <div className="flex gap-1">
      {inventory.shields > 0 && <span className="text-base">🛡️</span>}
      {inventory.bathroom > 0 && <span className="text-base">🚽</span>}
      {inventory.salute > 0 && <span className="text-base">🫡</span>}
    </div>
  )
}
