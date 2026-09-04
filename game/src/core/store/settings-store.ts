import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { Analytics } from '@/core/analytics'
import { StorageKeys } from '@/core/storage/keys'
import { webStorage } from '@/core/storage/local-storage'

import i18n from '@/i18n'

const SUPPORTED_LANGUAGES = ['pt-BR', 'en-US', 'es-ES'] as const

function getBrowserLanguage(): string {
  const tag = navigator.language ?? 'en-US'
  const exact = SUPPORTED_LANGUAGES.find((l) => l.toLowerCase() === tag.toLowerCase())
  if (exact) return exact
  const prefix = tag.split('-')[0].toLowerCase()
  if (prefix === 'pt') return 'pt-BR'
  if (prefix === 'es') return 'es-ES'
  return 'en-US'
}

interface SettingsState {
  language: string
  soundEnabled: boolean
  onboardingSeen: boolean
  disabledCardIds: string[]
  setLanguage: (lang: string) => void
  setSoundEnabled: (enabled: boolean) => void
  setOnboardingSeen: (seen: boolean) => void
  toggleCard: (id: string) => void
  toggleCardGroup: (ids: string[], allDisabled: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: getBrowserLanguage(),
      soundEnabled: true,
      onboardingSeen: false,
      disabledCardIds: [],
      setLanguage: (lang) => {
        const prev = useSettingsStore.getState().language
        set({ language: lang })
        i18n.changeLanguage(lang)
        Analytics.languageChanged({ from: prev, to: lang })
      },
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setOnboardingSeen: (seen) => set({ onboardingSeen: seen }),
      toggleCard: (id) =>
        set((state) => ({
          disabledCardIds: state.disabledCardIds.includes(id)
            ? state.disabledCardIds.filter((c) => c !== id)
            : [...state.disabledCardIds, id],
        })),
      toggleCardGroup: (ids, allDisabled) =>
        set((state) => ({
          disabledCardIds: allDisabled
            ? state.disabledCardIds.filter((c) => !ids.includes(c))
            : [...state.disabledCardIds.filter((c) => !ids.includes(c)), ...ids],
        })),
    }),
    {
      name: StorageKeys.SETTINGS,
      storage: createJSONStorage(() => webStorage),
    }
  )
)
