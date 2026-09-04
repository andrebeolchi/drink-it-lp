import { Navigate, Route, Routes } from 'react-router-dom'

import { useGameStore } from '@/core/store/game-store'
import { useSettingsStore } from '@/core/store/settings-store'

import { useAppInit } from '@/components/kit/use-app-init'

import { CustomCards } from '@/routes/custom-cards'
import { Game } from '@/routes/game'
import { History } from '@/routes/history'
import { Onboarding } from '@/routes/onboarding'
import { Results } from '@/routes/results'
import { Settings } from '@/routes/settings'
import { Setup } from '@/routes/setup'

function Index() {
  const isGameActive = useGameStore((s) => s.isGameActive)
  const onboardingSeen = useSettingsStore((s) => s.onboardingSeen)

  if (!onboardingSeen) return <Navigate to="/onboarding" replace />
  if (isGameActive) return <Navigate to="/game" replace />
  return <Navigate to="/setup" replace />
}

export function App() {
  const { isReady } = useAppInit()

  if (!isReady) return null

  return (
    <div className="mx-auto flex h-full max-w-lg flex-col bg-background">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/custom-cards" element={<CustomCards />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/game" element={<Game />} />
        <Route path="/results" element={<Results />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
