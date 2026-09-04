import { useState, type RefObject } from 'react'
import { useTranslation } from 'react-i18next'

import { downloadRankingCard, shareRankingCard } from '@/modules/report/share-ranking-card'

import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Text } from '@/components/ui/text'

interface Props {
  isVisible: boolean
  onClose: () => void
  rankingRef: RefObject<HTMLDivElement | null>
}

export function ShareSheet({ isVisible, onClose, rankingRef }: Props) {
  const { t } = useTranslation('common')
  const [loadingDownload, setLoadingDownload] = useState(false)
  const [loadingShare, setLoadingShare] = useState(false)
  const canShareFiles = typeof navigator.canShare === 'function'

  async function handleDownload() {
    if (!rankingRef.current) return
    setLoadingDownload(true)
    try {
      await downloadRankingCard(rankingRef.current)
      onClose()
    } finally {
      setLoadingDownload(false)
    }
  }

  async function handleShare() {
    if (!rankingRef.current) return
    setLoadingShare(true)
    try {
      await shareRankingCard({ node: rankingRef.current, dialogTitle: t('results.shareSheet.dialogTitle') })
      onClose()
    } finally {
      setLoadingShare(false)
    }
  }

  return (
    <Modal isVisible={isVisible} onClose={onClose} variant="bottomSheet">
      <div className="flex flex-col gap-5 px-5 pb-6 pt-5">
        <div className="flex items-center justify-between">
          <Text className="text-lg font-semibold text-foreground">{t('results.shareSheet.title')}</Text>
          <Button variant="ghost" size="sm" className="w-auto" onClick={onClose}>
            {t('common.close')}
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          <Button variant="secondary" loading={loadingDownload} onClick={handleDownload}>
            {t('results.shareSheet.savePhoto')}
          </Button>
          {canShareFiles && (
            <Button loading={loadingShare} onClick={handleShare}>
              {t('results.shareSheet.share')}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}
