import type { Player } from '@/core/types/player'

import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/components/ui/cn'
import { Text } from '@/components/ui/text'

const RANK_LABELS = ['🥇', '🥈', '🥉']

interface Props {
  players: Player[]
}

export function Leaderboard({ players }: Props) {
  const sorted = [...players].sort((a, b) => b.drinkCount - a.drinkCount)

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((item, index) => (
        <div key={item.id} className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3">
          <Text className="w-8 text-center text-xl">{RANK_LABELS[index] ?? `${index + 1}`}</Text>
          <Avatar name={item.name} avatarColor={item.avatarColor} size="md" />
          <Text className="flex-1 text-base font-medium text-foreground">{item.name}</Text>
          <Text className={cn('text-2xl font-bold', item.drinkCount > 0 ? 'text-accent' : 'text-subtle')}>
            {item.drinkCount}
          </Text>
        </div>
      ))}
    </div>
  )
}
