import { ChevronLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useSettingsStore } from '@/core/store/settings-store'
import type { CardCategory } from '@/core/types/card'

import { DECK } from '@/modules/deck/deck'

import { cn } from '@/components/ui/cn'
import { Text } from '@/components/ui/text'

const CATEGORY_I18N_KEY: Record<CardCategory, string> = {
  ACTION: 'card.categoryAction',
  GROUP: 'card.categoryGroup',
  GAME: 'card.categoryGame',
  REFLEX: 'card.categoryReflex',
  SHOWDOWN: 'card.categoryShowdown',
  MODIFIER: 'card.categoryModifier',
  BENEFIT: 'card.categoryBenefit',
}

const CATEGORY_STRIPE: Record<CardCategory, string> = {
  ACTION: 'bg-card-action',
  GROUP: 'bg-card-group',
  GAME: 'bg-card-game',
  REFLEX: 'bg-card-reflex',
  SHOWDOWN: 'bg-card-showdown',
  MODIFIER: 'bg-card-modifier',
  BENEFIT: 'bg-card-benefit',
}

const CATEGORY_ORDER: CardCategory[] = ['ACTION', 'GROUP', 'GAME', 'SHOWDOWN', 'REFLEX', 'MODIFIER', 'BENEFIT']

const GROUPED = CATEGORY_ORDER.map((category) => ({
  category,
  cards: DECK.filter((c) => c.category === category),
})).filter((g) => g.cards.length > 0)

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn('relative h-6 w-10 shrink-0 rounded-full transition-colors', checked ? 'bg-brand' : 'bg-surface-overlay')}
    >
      <span
        className={cn(
          'absolute top-0.5 h-5 w-5 rounded-full bg-foreground transition-transform',
          checked ? 'translate-x-[18px]' : 'translate-x-0.5'
        )}
      />
    </button>
  )
}

export function Settings() {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const disabledCardIds = useSettingsStore((s) => s.disabledCardIds)
  const toggleCard = useSettingsStore((s) => s.toggleCard)
  const toggleCardGroup = useSettingsStore((s) => s.toggleCardGroup)

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-background">
      <div className="flex flex-col gap-6 px-6 pb-6 pt-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="flex items-center gap-0.5">
            <ChevronLeft className="h-4 w-4 text-brand" />
            <Text className="text-sm text-brand">{t('common.cancel')}</Text>
          </button>
          <Text as="h1" className="font-syne text-xl font-bold text-foreground">
            {t('setup.minigames.sectionTitle')}
          </Text>
        </div>

        {GROUPED.map(({ category, cards }) => {
          const cardIds = cards.map((c) => c.id)
          const allDisabled = cardIds.every((id) => disabledCardIds.includes(id))

          return (
            <div key={category} className="overflow-hidden rounded-xl bg-surface">
              <div className="flex items-center justify-between border-b border-border px-3 py-3">
                <Text className="text-sm font-bold uppercase tracking-widest text-foreground">{t(CATEGORY_I18N_KEY[category])}</Text>
                <ToggleSwitch checked={!allDisabled} onChange={() => toggleCardGroup(cardIds, allDisabled)} />
              </div>
              {cards.map((card) => {
                const enabled = !disabledCardIds.includes(card.id)
                return (
                  <div key={card.id} className="relative flex items-center border-t border-border py-3 pl-6 pr-3">
                    <div className={cn('absolute bottom-0 left-0 top-0 w-1', CATEGORY_STRIPE[category])} />
                    <Text className={cn('flex-1 text-sm', enabled ? 'text-foreground' : 'text-muted line-through')}>
                      {t(`${card.i18nKey}.title`)}
                    </Text>
                    <ToggleSwitch checked={enabled} onChange={() => toggleCard(card.id)} />
                  </div>
                )
              })}
            </div>
          )
        })}

        <Text className="text-xs text-muted">{t('setup.minigames.hint')}</Text>
      </div>
    </div>
  )
}
