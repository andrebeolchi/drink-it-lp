import { useEffect, useState } from 'react'

import { useSettingsStore } from '@/core/store/settings-store'

import i18n from '@/i18n'

export function useAppInit() {
  const [isReady, setIsReady] = useState(false)
  const language = useSettingsStore((s) => s.language)

  useEffect(() => {
    i18n
      .changeLanguage(language)
      .catch((e) => console.warn('i18n init error:', e))
      .finally(() => setIsReady(true))
  }, [language])

  return { isReady }
}
