import { toBlob } from 'html-to-image'

import { Analytics } from '@/core/analytics'

async function captureNode(node: HTMLElement): Promise<Blob> {
  // skipFonts: the card's Google Fonts stylesheet is cross-origin without
  // CORS headers, so html-to-image can't read its cssRules to embed it —
  // it isn't needed anyway since every color/size here is a literal value.
  const blob = await toBlob(node, { pixelRatio: 2, skipFonts: true })
  if (!blob) throw new Error('Failed to capture ranking card')
  return blob
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
