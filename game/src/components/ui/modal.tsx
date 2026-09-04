import type { ReactNode } from 'react'

interface Props {
  isVisible: boolean
  onClose?: () => void
  children: ReactNode
  variant?: 'default' | 'bottomSheet'
}

export function Modal({ isVisible, onClose, children, variant = 'default' }: Props) {
  if (!isVisible) return null

  if (variant === 'bottomSheet') {
    return (
      <div className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={onClose}>
        <div
          className="animate-slide-up max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-surface"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    )
  }

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5"
      onClick={onClose}
    >
      <div
        className="animate-zoom-in w-full max-w-md overflow-hidden rounded-xl bg-surface"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
