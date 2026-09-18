import type { CSSProperties } from 'react'

import { cn } from '@/components/ui/cn'

export type CanState = 'idle' | 'pressed' | 'popped'

interface Props {
  state: CanState
  className?: string
}

const DROPLET_ANGLES = [-100, -70, -40, -15, 15, 40, 70, 100, 130, -130]

export function CanIllustration({ state, className }: Props) {
  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      {state === 'popped' && (
        <>
          <div className="animate-can-spray absolute left-1/2 top-2 h-24 w-24 -translate-x-1/2 rounded-full bg-accent/70" />
          {DROPLET_ANGLES.map((angle, i) => {
            const rad = (angle * Math.PI) / 180
            const distance = 70 + (i % 3) * 12
            const dx = Math.sin(rad) * distance
            const dy = -Math.abs(Math.cos(rad) * distance) - 10
            return (
              <span
                key={angle}
                className="animate-can-droplet absolute left-1/2 top-3 h-2 w-2 rounded-full bg-accent"
                style={{ '--dx': `${dx}px`, '--dy': `${dy}px`, animationDelay: `${i * 15}ms` } as CSSProperties}
              />
            )
          })}
        </>
      )}

      <svg
        viewBox="0 0 120 200"
        className={cn(
          'h-40 w-24 drop-shadow-xl',
          state === 'idle' && 'animate-can-idle',
          state === 'pressed' && 'animate-can-squash',
          state === 'popped' && 'animate-can-pop'
        )}
      >
        <defs>
          <linearGradient id="canBody" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(220 12% 78%)" />
            <stop offset="18%" stopColor="hsl(220 15% 92%)" />
            <stop offset="45%" stopColor="hsl(220 10% 65%)" />
            <stop offset="70%" stopColor="hsl(220 15% 92%)" />
            <stop offset="100%" stopColor="hsl(220 12% 60%)" />
          </linearGradient>
          <linearGradient id="canLabel" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={state === 'popped' ? 'hsl(var(--danger))' : 'hsl(var(--brand))'} />
            <stop offset="100%" stopColor={state === 'popped' ? 'hsl(4 90% 42%)' : 'hsl(262 70% 48%)'} />
          </linearGradient>
        </defs>

        {/* body */}
        <rect x="18" y="34" width="84" height="150" rx="14" fill="url(#canBody)" />
        {/* label band */}
        <rect x="18" y="76" width="84" height="60" fill="url(#canLabel)" />
        <text
          x="60"
          y="112"
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill="white"
          fontFamily="Syne, system-ui, sans-serif"
          letterSpacing="0.5"
        >
          SORTE
        </text>

        {/* rim */}
        <ellipse cx="60" cy="34" rx="42" ry="10" fill="hsl(220 10% 55%)" />
        <ellipse cx="60" cy="30" rx="38" ry="9" fill="hsl(220 15% 85%)" />

        {/* pull tab */}
        <g
          className={state === 'popped' ? 'animate-can-tab-fly' : undefined}
          style={{ transformOrigin: '60px 26px' }}
        >
          <rect x="50" y="18" width="20" height="8" rx="4" fill="hsl(220 10% 50%)" />
          <ellipse cx="60" cy="16" rx="7" ry="4" fill="none" stroke="hsl(220 10% 45%)" strokeWidth="2.5" />
        </g>

        {/* base */}
        <ellipse cx="60" cy="184" rx="42" ry="8" fill="hsl(220 10% 50%)" />
      </svg>
    </div>
  )
}
