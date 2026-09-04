// Lightweight analytics wrapper — same event surface as the mobile app's
// src/core/analytics.ts. No real analytics provider is wired up yet: events
// are logged to the console in dev and dropped in production. To turn this
// on, send `params` to your provider of choice (e.g. GA4 `gtag('event', ...)`)
// here — every call site already goes through this one module.
function track(eventName: string, params?: Record<string, string | number | boolean>) {
  if (import.meta.env.DEV) {
    console.info('[analytics]', eventName, params)
  }
}

export const Analytics = {
  gameStarted: ({ player_count }: { player_count: number }) => track('game_started', { player_count }),

  cardDrawn: ({ card_id, category }: { card_id: string; category: string }) =>
    track('card_drawn', { card_id, category }),

  minigameCompleted: ({ type, duration_ms }: { type: string; duration_ms: number }) =>
    track('minigame_completed', { type, duration_ms }),

  drinkRegistered: ({ card_id, was_blocked }: { card_id: string; was_blocked: boolean }) =>
    track('drink_registered', { card_id, was_blocked }),

  reportShared: ({ format }: { format: 'html' | 'pdf' | 'image' | 'link' }) =>
    track('report_shared', { format }),

  languageChanged: ({ from, to }: { from: string; to: string }) => track('language_changed', { from, to }),

  gameEnded: ({ player_count, total_drinks }: { player_count: number; total_drinks: number }) =>
    track('game_ended', { player_count, total_drinks }),
}
