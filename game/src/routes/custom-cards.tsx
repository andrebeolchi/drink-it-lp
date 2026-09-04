import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { useCustomCardsStore } from '@/core/store/custom-cards-store'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Text } from '@/components/ui/text'

const schema = z.object({
  title: z.string().min(1).max(50),
  body: z.string().max(200).optional(),
})
type FormData = z.infer<typeof schema>

export function CustomCards() {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const cards = useCustomCardsStore((s) => s.cards)
  const addCard = useCustomCardsStore((s) => s.addCard)
  const removeCard = useCustomCardsStore((s) => s.removeCard)
  const [showForm, setShowForm] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { title: '', body: '' } })

  function onAdd({ title, body }: FormData) {
    addCard(title, body ?? '')
    reset()
    setShowForm(false)
  }

  function onClose() {
    reset()
    setShowForm(false)
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 pt-6">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="py-1 pr-3">
            <Text className="text-sm text-brand">← {t('common.cancel')}</Text>
          </button>
          <Text as="h1" className="font-syne text-xl font-bold text-foreground">
            {t('setup.customCards.title')}
          </Text>
          <div className="w-16" />
        </div>

        <div className="flex flex-col gap-3">
          {cards.map((item) => (
            <div key={item.id} className="relative overflow-hidden rounded-xl bg-surface">
              <div className="absolute bottom-0 left-0 top-0 w-1 bg-card-action" />
              <div className="flex items-start py-3 pl-6 pr-3">
                <div className="flex-1">
                  <Text truncate className="text-base font-semibold text-foreground">
                    {item.customTitle}
                  </Text>
                  {item.customBody ? (
                    <Text className="mt-1 line-clamp-2 text-sm text-muted">{item.customBody}</Text>
                  ) : null}
                </div>
                <button onClick={() => removeCard(item.id)} className="ml-3 mt-1">
                  <Text className="text-sm text-danger">{t('setup.customCards.delete')}</Text>
                </button>
              </div>
            </div>
          ))}
          {cards.length === 0 && (
            <div className="mt-6 flex items-center justify-center">
              <Text className="text-center text-sm text-muted">{t('setup.customCards.empty')}</Text>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border px-6 py-3">
        <Button onClick={() => setShowForm(true)}>{t('setup.customCards.add')}</Button>
      </div>

      <Modal isVisible={showForm} onClose={onClose} variant="bottomSheet">
        <form className="flex flex-col gap-6 p-6" onSubmit={handleSubmit(onAdd)}>
          <Text className="text-lg font-semibold text-foreground">{t('setup.customCards.add')}</Text>

          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <Input
                label={t('setup.customCards.cardTitle')}
                placeholder={t('setup.customCards.cardTitle')}
                error={errors.title?.message}
                maxLength={50}
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="body"
            render={({ field }) => (
              <Input
                label={t('setup.customCards.cardBody')}
                placeholder={t('setup.customCards.cardBody')}
                error={errors.body?.message}
                maxLength={200}
                multiline
                rows={3}
                {...field}
              />
            )}
          />

          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">{t('common.confirm')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
