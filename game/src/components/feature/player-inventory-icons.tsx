import { Hand, Shield, Toilet } from 'lucide-react'

import type { Player } from '@/core/types/player'

export function PlayerInventoryIcons({ inventory }: { inventory: Player['inventory'] }) {
  if (inventory.shields === 0 && inventory.bathroom === 0 && inventory.salute === 0) return null

  return (
    <div className="flex items-center gap-1 text-muted">
      {inventory.shields > 0 && <Shield className="h-4 w-4" />}
      {inventory.bathroom > 0 && <Toilet className="h-4 w-4" />}
      {inventory.salute > 0 && <Hand className="h-4 w-4" />}
    </div>
  )
}
