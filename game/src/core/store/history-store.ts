import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { StorageKeys } from '@/core/storage/keys'
import { webStorage } from '@/core/storage/local-storage'
import type { GameSession } from '@/core/types'

const MAX_SESSIONS = 20

interface HistoryState {
  sessions: GameSession[]
  addSession: (session: GameSession) => void
  clearHistory: () => void
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      sessions: [],
      addSession: (session) =>
        set((state) => ({
          sessions: [session, ...state.sessions].slice(0, MAX_SESSIONS),
        })),
      clearHistory: () => set({ sessions: [] }),
    }),
    {
      name: StorageKeys.HISTORY,
      storage: createJSONStorage(() => webStorage),
    }
  )
)
