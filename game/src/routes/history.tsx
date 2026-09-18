import { X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useHistoryStore } from '@/core/store/history-store'

import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Text } from '@/components/ui/text'

import i18n from '@/i18n'

export function History() {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const sessions = useHistoryStore((s) => s.sessions)
  const clearHistory = useHistoryStore((s) => s.clearHistory)
  const [confirmVisible, setConfirmVisible] = useState(false)

  function formatDate(timestamp: number) {
    return new Date(timestamp).toLocaleDateString(i18n.language, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  function formatDuration(ms: number) {
    const min = Math.floor(ms / 60000)
    const sec = Math.floor((ms % 60000) / 1000)
    return t('history.durationFormat', { min, sec })
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      <div className="flex items-center justify-between p-5">
        <Text as="h1" className="text-3xl font-bold text-foreground">
          {t('history.title')}
        </Text>
        <Button variant="ghost" size="sm" className="w-auto" onClick={() => navigate(-1)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-5">
        {sessions.map((item) => (
          <div key={item.id} className="flex flex-col gap-2 rounded-xl bg-surface p-4">
            <div className="flex justify-between">
              <Text className="text-sm font-medium text-foreground">{formatDate(item.sessionDate)}</Text>
              <Text className="text-xs text-muted">{formatDuration(item.durationMs)}</Text>
            </div>
            <Text className="text-xs text-muted">
              {t('history.players', { count: item.playerRanking.length })} · {t('history.drinks', { count: item.totalDrinks })} ·{' '}
              {t('history.cards', { count: item.cardCount })}
            </Text>
            <Text className="text-xs text-subtle">{item.playerRanking.map((p) => p.name).join(', ')}</Text>
          </div>
        ))}
        {sessions.length === 0 && <Text className="mt-8 text-center text-sm text-muted">{t('history.empty')}</Text>}
      </div>

      {sessions.length > 0 && (
        <div className="border-t border-border px-5 py-4">
          <Button variant="danger" onClick={() => setConfirmVisible(true)}>
            {t('history.clearHistory')}
          </Button>
        </div>
      )}

      <Modal isVisible={confirmVisible} onClose={() => setConfirmVisible(false)}>
        <div className="flex flex-col gap-4 p-5">
          <Text className="text-base text-foreground">{t('history.confirmClear')}</Text>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setConfirmVisible(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                clearHistory()
                setConfirmVisible(false)
              }}
            >
              {t('common.confirm')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
