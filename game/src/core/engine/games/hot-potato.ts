const MIN_TIMER_MS = 5000
const MAX_TIMER_MS = 12000

export function getHotPotatoTimer(): number {
  return Math.floor(Math.random() * (MAX_TIMER_MS - MIN_TIMER_MS + 1)) + MIN_TIMER_MS
}
