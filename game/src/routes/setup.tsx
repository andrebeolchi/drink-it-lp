import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { useCustomCardsStore } from '@/core/store/custom-cards-store'
import { useGameStore } from '@/core/store/game-store'
import { useSettingsStore } from '@/core/store/settings-store'
import type { Player } from '@/core/types/player'

import { createPlayer, getNextAvatarColor } from '@/modules/players/player-utils'

import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'

const LANGUAGES = [
  { code: 'pt-BR', label: '🇧🇷' },
  { code: 'en-US', label: '🇺🇸' },
  { code: 'es-ES', label: '🇪🇸' },
] as const

const schema = z.object({
  name: z.string().min(1).max(20),
})
type FormData = z.infer<typeof schema>

export function Setup() {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const startGame = useGameStore((s) => s.startGame)
  const language = useSettingsStore((s) => s.language)
  const setLanguage = useSettingsStore((s) => s.setLanguage)
  const disabledCardIds = useSettingsStore((s) => s.disabledCardIds)
  const customCards = useCustomCardsStore((s) => s.cards)
  const [players, setPlayers] = useState<Player[]>([])

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { name: '' } })

  function onAddPlayer({ name }: FormData) {
    const avatarColor = getNextAvatarColor(players)
    setPlayers((prev) => [...prev, createPlayer({ name, avatarColor })])
    reset()
  }

  function onRemovePlayer(id: string) {
    setPlayers((prev) => prev.filter((p) => p.id !== id))
  }

  function onStartGame() {
    if (players.length < 2) return
    startGame({ players })
    navigate('/game', { replace: true })
  }

  const disabledCount = disabledCardIds.length

  return (
    <div className="flex flex-1 flex-col bg-background">
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 pt-6">
        <div className="flex items-center justify-between">
          <Text as="h1" className="font-syne text-3xl font-extrabold text-foreground">
            {t('setup.title')}
          </Text>
          <div className="flex gap-2">
            {LANGUAGES.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setLanguage(code)}
                className={`rounded-full border px-3 py-2 ${
                  language === code ? 'border-brand bg-brand/20' : 'border-border'
                }`}
              >
                <Text className="text-sm font-medium">{label}</Text>
              </button>
            ))}
          </div>
        </div>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onAddPlayer)}>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input placeholder={t('setup.playerNamePlaceholder')} error={errors.name?.message} maxLength={20} {...field} />
            )}
          />
          <Button type="submit" variant="secondary">
            {t('setup.addPlayer')}
          </Button>
        </form>

        <div className="flex flex-col gap-3">
          {players.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-xl bg-surface px-3 py-3">
              <Avatar name={item.name} avatarColor={item.avatarColor} size="md" />
              <Text className="flex-1 text-base font-medium text-foreground">{item.name}</Text>
              <button onClick={() => onRemovePlayer(item.id)}>
                <Text className="text-sm text-danger">{t('common.remove')}</Text>
              </button>
            </div>
          ))}
          {players.length === 0 && <Text className="mt-3 text-center text-sm text-muted">{t('setup.minPlayers')}</Text>}
        </div>

        <div className="flex flex-col gap-3 pb-2">
          <button
            onClick={() => navigate('/custom-cards')}
            className="flex items-center justify-between rounded-xl bg-surface px-3 py-3"
          >
            <Text className="text-sm font-medium text-foreground">{t('setup.customCards.title')}</Text>
            {customCards.length > 0 ? (
              <span className="rounded-full bg-brand px-2 py-1">
                <Text className="text-xs font-bold text-brand-foreground">{customCards.length}</Text>
              </span>
            ) : (
              <Text className="text-sm text-muted">›</Text>
            )}
          </button>

          <button
            onClick={() => navigate('/settings')}
            className="flex items-center justify-between rounded-xl bg-surface px-3 py-3"
          >
            <Text className="text-sm font-medium text-foreground">{t('setup.minigames.sectionTitle')}</Text>
            {disabledCount > 0 ? (
              <span className="rounded-full bg-warning/20 px-2 py-1">
                <Text className="text-xs font-bold text-warning">{t('setup.minigames.disabledCount', { count: disabledCount })}</Text>
              </span>
            ) : (
              <Text className="text-sm text-muted">›</Text>
            )}
          </button>

          <button
            onClick={() => navigate('/history')}
            className="flex items-center justify-between rounded-xl bg-surface px-3 py-3"
          >
            <Text className="text-sm font-medium text-foreground">{t('history.title')}</Text>
            <Text className="text-sm text-muted">›</Text>
          </button>
        </div>
      </div>

      <div className="border-t border-border px-6 py-3">
        <Button onClick={onStartGame} disabled={players.length < 2}>
          {t('setup.startGame')}
        </Button>
      </div>
    </div>
  )
}
