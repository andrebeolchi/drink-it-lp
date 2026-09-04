import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

import type { AvatarColor, Player } from '@/core/types/player'

import i18n from '@/i18n'

const AVATAR_HEX: Record<AvatarColor, string> = {
  coral: '#f04438',
  violet: '#8950eb',
  cyan: '#30aee8',
  amber: '#f6aa28',
  green: '#2eb860',
  pink: '#e250bb',
  sky: '#3e94ea',
  lime: '#8bce27',
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

interface Props {
  players: Player[]
  totalDrinks: number
  sessionDate: number
  durationMs: number
  mostPlayedCardTitle?: string
  mostPlayedCardCount?: number
  barmanPlayer?: Player
  barmanCount?: number
  className?: string
}

function PlayerRow({ player, rank }: { player: Player; rank: number }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-[#0e1f2e] px-3.5 py-2.5">
      <span
        className="w-5 shrink-0 text-center text-[13px] font-bold"
        style={{ color: rank === 1 ? '#f6aa28' : '#546878' }}
      >
        {rank}
      </span>
      <div
        className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: AVATAR_HEX[player.avatarColor] }}
      >
        <span className="text-[11px] font-bold text-white">{initials(player.name)}</span>
      </div>
      <span className="flex-1 truncate text-sm font-semibold text-[#f4f7f9]">{player.name}</span>
      <span
        className="text-xl font-bold"
        style={{ color: player.drinkCount > 0 ? '#f2553a' : '#3d5060' }}
      >
        {player.drinkCount}
      </span>
    </div>
  )
}

export const RankingCard = forwardRef<HTMLDivElement, Props>(function RankingCard(
  {
    players,
    totalDrinks,
    sessionDate,
    durationMs,
    mostPlayedCardTitle,
    mostPlayedCardCount,
    barmanPlayer,
    barmanCount,
    className,
  },
  ref
) {
  const { t } = useTranslation('common')

  const sorted = [...players].sort((a, b) => b.drinkCount - a.drinkCount)
  const top5 = sorted.slice(0, 5)
  const leastDrinker = sorted[sorted.length - 1]
  const showLeast = sorted.length > 1

  const date = new Date(sessionDate).toLocaleDateString(i18n.language, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  const totalMin = Math.floor(durationMs / 60000)
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  const duration = h > 0 ? t('results.rankingCard.durationHour', { h, m }) : t('results.rankingCard.durationMin', { m })

  return (
    <div
      ref={ref}
      className={className}
      style={{
        width: 360,
        backgroundColor: '#07111a',
        padding: 20,
        borderRadius: 20,
        border: '1px solid #1b3040',
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="font-syne text-xl font-bold text-[#f4f7f9]">{t('setup.title')}</span>
        <span className="text-[11px] text-[#546878]">{date}</span>
      </div>

      <div className="mb-4 flex gap-2">
        <div className="flex-1 rounded-xl bg-[#0e1f2e] p-3">
          <div className="text-[10px] font-semibold tracking-wide text-[#546878]">
            {t('results.rankingCard.totalDrinks')}
          </div>
          <div className="mt-0.5 text-[28px] font-bold text-[#f2553a]">{totalDrinks}</div>
        </div>
        {mostPlayedCardTitle ? (
          <div className="flex-1 rounded-xl bg-[#0e1f2e] p-3">
            <div className="text-[10px] font-semibold tracking-wide text-[#546878]">
              {t('results.rankingCard.mostPlayed')}
            </div>
            <div className="mt-1 line-clamp-2 text-[13px] font-semibold text-[#f4f7f9]">{mostPlayedCardTitle}</div>
            {mostPlayedCardCount != null && (
              <div className="mt-0.5 text-base font-bold text-[#f2553a]">{mostPlayedCardCount}×</div>
            )}
          </div>
        ) : null}
      </div>

      <div className="mb-2 text-[10px] font-semibold tracking-wide text-[#546878]">
        {t('results.rankingCard.top', { count: top5.length })}
      </div>
      <div className="flex flex-col gap-1.5">
        {top5.map((player, i) => (
          <PlayerRow key={player.id} player={player} rank={i + 1} />
        ))}
      </div>

      {showLeast && leastDrinker ? (
        <>
          <div className="mb-3 mt-3.5 h-px bg-[#1b3040]" />
          <div className="mb-2 text-[10px] font-semibold tracking-wide text-[#546878]">
            {t('results.rankingCard.drankLeast')}
          </div>
          <PlayerRow player={leastDrinker} rank={sorted.length} />
        </>
      ) : null}

      {barmanPlayer && barmanCount ? (
        <>
          <div className="mb-3 mt-3.5 h-px bg-[#1b3040]" />
          <div className="mb-2 text-[10px] font-semibold tracking-wide text-[#546878]">
            {t('results.rankingCard.barman')}
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-[#0e1f2e] px-3.5 py-2.5">
            <div
              className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: AVATAR_HEX[barmanPlayer.avatarColor] }}
            >
              <span className="text-[11px] font-bold text-white">{initials(barmanPlayer.name)}</span>
            </div>
            <span className="flex-1 truncate text-sm font-semibold text-[#f4f7f9]">{barmanPlayer.name}</span>
            <span className="text-sm font-bold text-[#f2553a]">{barmanCount}🏆</span>
          </div>
        </>
      ) : null}

      <div className="mt-3.5 flex items-center justify-between border-t border-[#1b3040] pt-3">
        <span className="text-[11px] text-[#546878]">{duration}</span>
        <span className="text-[11px] text-[#3d5060]">drink-it</span>
      </div>
    </div>
  )
})
