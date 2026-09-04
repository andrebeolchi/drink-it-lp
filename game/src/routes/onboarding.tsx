import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useSettingsStore } from '@/core/store/settings-store'

import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'

const SLIDES = ['slide1', 'slide2', 'slide3'] as const

export function Onboarding() {
  const { t } = useTranslation('howToPlay')
  const navigate = useNavigate()
  const setOnboardingSeen = useSettingsStore((s) => s.setOnboardingSeen)
  const [currentIndex, setCurrentIndex] = useState(0)

  const isLast = currentIndex === SLIDES.length - 1

  function handleNext() {
    if (isLast) {
      setOnboardingSeen(true)
      navigate('/setup', { replace: true })
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }

  function handleSkip() {
    setOnboardingSeen(true)
    navigate('/setup', { replace: true })
  }

  const slide = SLIDES[currentIndex]

  return (
    <div className="flex flex-1 flex-col bg-background">
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-6 px-8">
          <Text as="h1" className="text-center text-3xl font-bold text-foreground">
            {t(`onboarding.${slide}.title`)}
          </Text>
          <Text className="text-center text-base leading-relaxed text-muted">{t(`onboarding.${slide}.body`)}</Text>
        </div>
      </div>

      <div className="mb-6 flex justify-center gap-2">
        {SLIDES.map((_, i) => (
          <div key={i} className={`h-2 rounded-full ${i === currentIndex ? 'w-6 bg-brand' : 'w-2 bg-subtle'}`} />
        ))}
      </div>

      <div className="flex flex-col gap-3 px-5 pb-6">
        <Button onClick={handleNext}>{isLast ? t('onboarding.start', { ns: 'common' }) : t('onboarding.next', { ns: 'common' })}</Button>
        {!isLast && (
          <Button variant="ghost" onClick={handleSkip}>
            {t('onboarding.skip', { ns: 'common' })}
          </Button>
        )}
      </div>
    </div>
  )
}
