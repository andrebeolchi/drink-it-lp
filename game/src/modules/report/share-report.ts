import { Analytics } from '@/core/analytics'
import type { GameStats } from '@/core/types/game'

import { generateGameReport } from '@/modules/report/generate-game-report'

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export async function shareReport(stats: GameStats, gameDurationMs: number): Promise<void> {
  const html = generateGameReport(stats, gameDurationMs)
  const file = new File([html], 'party-it-relatorio.html', { type: 'text/html' })

  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: 'Party It — Relatório' })
    Analytics.reportShared({ format: 'html' })
    return
  }

  downloadBlob(file, file.name)
  Analytics.reportShared({ format: 'html' })
}
