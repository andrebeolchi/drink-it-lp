import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { CardProps } from '@/core/engine/card-registry'
import { createModifier } from '@/core/engine/games/modifier-game'
import { useGameStore } from '@/core/store/game-store'

import { CardBase } from '@/components/feature/card-base'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'

export function ModifierCard({ card, onComplete }: CardProps) {
  const { t } = useTranslation()
  const addModifier = useGameStore((s) => s.addModifier)
  const removeModifier = useGameStore((s) => s.removeModifier)
  const activeModifiers = useGameStore((s) => s.activeModifiers)
  const [ruleText, setRuleText] = useState('')
  const isRemoveRule = card.id === 'card_remove_rule'

  function handleApply() {
    if (isRemoveRule) {
      onComplete()
      return
    }
    const label = ruleText.trim() || t(`${card.i18nKey}.title`)
    const modifier = createModifier({ card, label })
    addModifier(modifier)
    onComplete()
  }

  return (
    <CardBase card={card} title={t(`${card.i18nKey}.title`)} description={t(`${card.i18nKey}.description`)} onSkip={onComplete}>
      <div className="mt-2 flex flex-col gap-3">
        {isRemoveRule && activeModifiers.some((m) => m.type === 'RULE_ADD') ? (
          <div className="flex flex-col gap-2">
            {activeModifiers
              .filter((m) => m.type === 'RULE_ADD')
              .map((m) => (
                <div key={m.id} className="flex items-center gap-3 rounded-lg bg-surface-raised px-3 py-2">
                  <Text className="flex-1 text-sm text-foreground">{m.label}</Text>
                  <Button
                    size="sm"
                    variant="danger"
                    className="w-auto"
                    onClick={() => {
                      removeModifier(m.id)
                      onComplete()
                    }}
                  >
                    {t('common.remove', { ns: 'common' })}
                  </Button>
                </div>
              ))}
          </div>
        ) : !isRemoveRule && card.id === 'card_add_rule' ? (
          <Input
            placeholder={t('card.ruleDescriptionPlaceholder', { ns: 'common' })}
            value={ruleText}
            onChange={(e) => setRuleText(e.target.value)}
            maxLength={60}
          />
        ) : null}
        <Button onClick={handleApply}>{t('card.done', { ns: 'common' })}</Button>
      </div>
    </CardBase>
  )
}
