const MIN_TRIGGER_PRESS = 3
const MAX_TRIGGER_PRESS = 8

// The press number (1-indexed) that makes the can pop, decided once per round
// so the outcome is fixed but nobody knows it in advance — same principle as
// the physical "roleta da latinha" toy.
export function getCanRouletteTrigger(): number {
  return Math.floor(Math.random() * (MAX_TRIGGER_PRESS - MIN_TRIGGER_PRESS + 1)) + MIN_TRIGGER_PRESS
}
