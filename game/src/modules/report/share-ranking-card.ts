import { toBlob, toPng } from 'html-to-image'

import { Analytics } from '@/core/analytics'

async function captureNode(node: HTMLElement): Promise<Blob> {
  const blob = await toBlob(node, { pixelRatio: 2 })
  if (!blob) throw new Error('Failed to capture ranking card')
  return blob
}

export async function captureRankingCardAsDataUri(node: HTMLElement): Promise<string> {
  return toPng(node, { pixelRatio: 2 })
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export async function shareRankingCard({ node, dialogTitle }: { node: HTMLElement; dialogTitle: string }): Promise<void> {
  const blob = await captureNode(node)
  const file = new File([blob], 'party-it-ranking.png', { type: 'image/png' })

  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: dialogTitle })
    Analytics.reportShared({ format: 'image' })
    return
  }

  downloadBlob(file, file.name)
  Analytics.reportShared({ format: 'image' })
}

export async function downloadRankingCard(node: HTMLElement): Promise<void> {
  const blob = await captureNode(node)
  downloadBlob(blob, 'party-it-ranking.png')
  Analytics.reportShared({ format: 'image' })
}
