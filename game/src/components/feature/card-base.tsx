import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { getCurrentPlayer, useGameStore } from '@/core/store/game-store'
import type { DeckCard } from '@/core/types/card'

import { CARD_STRIPE_CLASSES } from '@/components/kit/theme'
import { Avatar } from '@/components/ui/avatar'
import { CategoryBadge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { SimpleMarkdown } from '@/components/ui/simple-markdown'
import { Text } from '@/components/ui/text'

interface Props {
  card: DeckCard
  title: string
  description: string
  onSkip?: () => void
  children?: ReactNode
}

export function CardBase({ card, title, description, onSkip, children }: Props) {
  const { t } = useTranslation('common')
  const players = useGameStore((s) => s.players)
  const currentCardIndex = useGameStore((s) => s.currentCardIndex)
  const currentPlayer = getCurrentPlayer({ players, currentCardIndex })

  const rules = t(`${card.i18nKey}.rules`, { ns: 'decks', defaultValue: '' })
  const [rulesVisible, setRulesVisible] = useState(false)

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-surface">
      <div className={`absolute bottom-0 left-0 top-0 w-1 ${CARD_STRIPE_CLASSES[card.category]}`} />
      {currentPlayer && (
        <div className="flex items-center gap-2 border-b border-border/50 bg-surface-raised px-4 py-2 pl-5">
          <Avatar name={currentPlayer.name} avatarColor={currentPlayer.avatarColor} size="sm" />
          <Text truncate className="flex-1 text-xs font-medium text-muted">
            {t('game.turnOf')} <Text className="font-semibold text-foreground">{currentPlayer.name}</Text>
          </Text>
          {rules ? (
            <button
              onClick={() => setRulesVisible(true)}
              className="flex items-center gap-1 rounded-full border border-border px-3 py-1"
            >
              <Text className="text-xs text-muted">{t('card.howToPlay')}</Text>
            </button>
          ) : null}
        </div>
      )}
      <div className="flex flex-col gap-3 p-5 pl-6">
        <CategoryBadge category={card.category} />
        <Text as="h2" className="font-syne text-xl text-foreground">
          {title}
        </Text>
        {description ? <Text className="text-base leading-relaxed text-muted">{description}</Text> : null}
        {children}
      </div>
      {onSkip && (
        <button onClick={onSkip} className="w-full border-t border-border/30 py-3 text-center">
          <Text className="text-xs text-subtle">{t('card.skip')}</Text>
        </button>
      )}

      <Modal isVisible={rulesVisible} onClose={() => setRulesVisible(false)}>
        <div className="flex flex-col gap-4 p-5">
          <div className="flex items-center justify-between">
            <Text as="h3" className="text-lg font-bold text-foreground">
              {title}
            </Text>
            <button onClick={() => setRulesVisible(false)}>
              <Text className="text-sm text-muted">✕</Text>
            </button>
          </div>
          <SimpleMarkdown content={rules} />
        </div>
      </Modal>
    </div>
  )
}
