import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useGameStore } from '@/core/store/game-store'

import { RankingCard } from '@/components/feature/ranking-card'
import { ShareSheet } from '@/components/feature/share-sheet'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'

const SKIP_CATEGORIES = ['BENEFIT', 'MODIFIER'] as const

export function Results() {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const [shareSheetVisible, setShareSheetVisible] = useState(false)
  const rankingRef = useRef<HTMLDivElement>(null)

  const players = useGameStore((s) => s.players)
  const discardPile = useGameStore((s) => s.discardPile)
  const startTimestamp = useGameStore((s) => s.startTimestamp)
  const startGame = useGameStore((s) => s.startGame)
  const resetGame = useGameStore((s) => s.resetGame)

  const totalDrinks = players.reduce((sum, p) => sum + p.drinkCount, 0)
  const durationMs = Date.now() - startTimestamp

  const gamingCards = discardPile.filter((c) => !SKIP_CATEGORIES.includes(c.category as (typeof SKIP_CATEGORIES)[number]))
  const cardCounts = gamingCards.reduce<Record<string, number>>((acc, card) => {
    acc[card.id] = (acc[card.id] ?? 0) + 1
    return acc
  }, {})
  const mostPlayedId = Object.entries(cardCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
  const mostPlayedCard = mostPlayedId ? gamingCards.find((c) => c.id === mostPlayedId) : null
  const mostPlayedCardTitle = mostPlayedCard
    ? (mostPlayedCard.customTitle ?? t(`${mostPlayedCard.i18nKey}.title`))
    : undefined
  const mostPlayedCardCount = mostPlayedId ? cardCounts[mostPlayedId] : undefined

  const drinksCaused = players.reduce<Record<string, number>>((acc, p) => {
    for (const entry of p.drinkLog) {
      if (!entry.wasBlocked && entry.causedByPlayerId) {
        acc[entry.causedByPlayerId] = (acc[entry.causedByPlayerId] ?? 0) + 1
      }
    }
    return acc
  }, {})
  const barmanId = Object.entries(drinksCaused).sort((a, b) => b[1] - a[1])[0]?.[0]
  const barmanPlayer = barmanId ? players.find((p) => p.id === barmanId) : undefined
  const barmanCount = barmanId ? drinksCaused[barmanId] : undefined

  function handlePlayAgain() {
    startGame({ players })
    navigate('/game', { replace: true })
  }

  function handleHome() {
    resetGame()
    navigate('/setup', { replace: true })
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 pb-4 pt-6">
        <div className="flex flex-col gap-1">
          <Text as="h1" className="font-syne text-3xl font-extrabold text-foreground">
            {t('results.title')}
          </Text>
          <Text className="text-base text-muted">{t('results.subtitle')}</Text>
        </div>

        <div className="flex justify-center">
          <RankingCard
            ref={rankingRef}
            players={players}
            totalDrinks={totalDrinks}
            sessionDate={startTimestamp}
            durationMs={durationMs}
            mostPlayedCardTitle={mostPlayedCardTitle}
            mostPlayedCardCount={mostPlayedCardCount}
            barmanPlayer={barmanPlayer}
            barmanCount={barmanCount}
            className="max-w-full"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-border px-5 pb-6 pt-4">
        <Button onClick={() => setShareSheetVisible(true)}>{t('results.shareRanking')}</Button>
        <Button onClick={handlePlayAgain}>{t('results.playAgain')}</Button>
        <Button variant="ghost" onClick={handleHome}>
          {t('results.home')}
        </Button>
      </div>

      <ShareSheet isVisible={shareSheetVisible} onClose={() => setShareSheetVisible(false)} rankingRef={rankingRef} />
    </div>
  )
}
