import { v4 as uuidv4 } from 'uuid'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { webStorage } from '@/core/storage/local-storage'
import { StorageKeys } from '@/core/storage/keys'
import type { DeckCard } from '@/core/types/card'

interface CustomCardsState {
  cards: DeckCard[]
  addCard: (title: string, body: string) => void
  removeCard: (id: string) => void
}

export const useCustomCardsStore = create<CustomCardsState>()(
  persist(
    (set) => ({
      cards: [],

      addCard: (title, body) =>
        set((state) => ({
          cards: [
            ...state.cards,
            {
              id: `custom_${uuidv4()}`,
              category: 'ACTION',
              minigameType: 'DIRECT_TARGET',
              i18nKey: '',
              customTitle: title,
              customBody: body,
            },
          ],
        })),

      removeCard: (id) =>
        set((state) => ({
          cards: state.cards.filter((c) => c.id !== id),
        })),
    }),
    {
      name: StorageKeys.CUSTOM_CARDS,
      storage: createJSONStorage(() => webStorage),
    }
  )
)
