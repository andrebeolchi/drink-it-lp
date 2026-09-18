import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { useGameStore } from '@/core/store/game-store'

import { createPlayer, getNextAvatarColor } from '@/modules/players/player-utils'

import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Text } from '@/components/ui/text'

const schema = z.object({
  name: z.string().min(1).max(20),
})
type FormData = z.infer<typeof schema>

interface Props {
  isVisible: boolean
  onClose: () => void
}

export function ManagePlayersSheet({ isVisible, onClose }: Props) {
  const { t } = useTranslation('common')
  const players = useGameStore((s) => s.players)
  const addPlayerMidGame = useGameStore((s) => s.addPlayerMidGame)
  const removePlayerMidGame = useGameStore((s) => s.removePlayerMidGame)

  const activePlayers = players.filter((p) => p.isActive)
  const removedPlayers = players.filter((p) => !p.isActive)
  const canRemove = activePlayers.length > 2

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { name: '' } })

  function onAddPlayer({ name }: FormData) {
    const avatarColor = getNextAvatarColor(players)
    addPlayerMidGame(createPlayer({ name, avatarColor }))
    reset()
  }

  return (
    <Modal isVisible={isVisible} onClose={onClose} variant="bottomSheet">
      <div className="flex flex-col gap-5 px-5 pb-6 pt-5">
        <div className="flex items-center justify-between">
          <Text className="text-lg font-semibold text-foreground">{t('game.managePlayers.title')}</Text>
          <Button variant="ghost" size="sm" className="w-auto" onClick={onClose}>
            {t('common.close')}
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          {activePlayers.map((player) => (
            <div key={player.id} className="flex items-center gap-3 rounded-lg bg-surface-raised px-3 py-2">
              <Avatar name={player.name} avatarColor={player.avatarColor} size="sm" />
              <Text truncate className="flex-1 text-sm font-medium text-foreground">
                {player.name}
              </Text>
              <button
                onClick={() => removePlayerMidGame(player.id)}
                disabled={!canRemove}
                className="disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Text className="text-sm text-danger">{t('game.managePlayers.remove')}</Text>
              </button>
            </div>
          ))}
          {removedPlayers.map((player) => (
            <div key={player.id} className="flex items-center gap-3 rounded-lg bg-surface-raised/50 px-3 py-2 opacity-50">
              <Avatar name={player.name} avatarColor={player.avatarColor} size="sm" />
              <Text truncate className="flex-1 text-sm font-medium text-muted line-through">
                {player.name}
              </Text>
              <Text className="text-xs text-subtle">{t('game.managePlayers.removed')}</Text>
            </div>
          ))}
          {!canRemove && <Text className="text-xs text-subtle">{t('game.managePlayers.minPlayersHint')}</Text>}
        </div>

        <form className="flex flex-col gap-3 border-t border-border pt-4" onSubmit={handleSubmit(onAddPlayer)}>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input placeholder={t('game.managePlayers.addPlaceholder')} error={errors.name?.message} maxLength={20} {...field} />
            )}
          />
          <Button type="submit" variant="secondary">
            {t('game.managePlayers.addNew')}
          </Button>
        </form>
      </div>
    </Modal>
  )
}
