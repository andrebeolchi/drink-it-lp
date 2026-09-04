import type { DeckCard } from '@/core/types'

export const DECK: DeckCard[] = [
  // DIRECT_TARGET
  {
    id: 'card_point_1',
    category: 'ACTION',
    minigameType: 'DIRECT_TARGET',
    i18nKey: 'decks:cards.point_1',
    targetCount: 1,
  },
  {
    id: 'card_point_2',
    category: 'ACTION',
    minigameType: 'DIRECT_TARGET',
    i18nKey: 'decks:cards.point_2',
    targetCount: 2,
  },
  {
    id: 'card_point_3',
    category: 'ACTION',
    minigameType: 'DIRECT_TARGET',
    i18nKey: 'decks:cards.point_3',
    targetCount: 3,
  },
  {
    id: 'card_all_men',
    category: 'ACTION',
    minigameType: 'DIRECT_TARGET',
    i18nKey: 'decks:cards.all_men',
  },
  {
    id: 'card_all_women',
    category: 'ACTION',
    minigameType: 'DIRECT_TARGET',
    i18nKey: 'decks:cards.all_women',
  },
  {
    id: 'card_everyone',
    category: 'ACTION',
    minigameType: 'DIRECT_TARGET',
    i18nKey: 'decks:cards.everyone',
  },

  // GROUP_DYNAMIC
  {
    id: 'card_reverso',
    category: 'ACTION',
    minigameType: 'REVERSO',
    i18nKey: 'decks:cards.reverso',
  },
  {
    id: 'card_never_have_i',
    category: 'GROUP',
    minigameType: 'GROUP_DYNAMIC',
    i18nKey: 'decks:cards.never_have_i',
  },
  {
    id: 'card_putinha',
    category: 'GROUP',
    minigameType: 'GROUP_DYNAMIC',
    i18nKey: 'decks:cards.putinha',
  },

  // SEQUENTIAL_GAME
  {
    id: 'card_pi_game',
    category: 'GAME',
    minigameType: 'SEQUENTIAL_GAME',
    i18nKey: 'decks:cards.pi_game',
  },
  {
    id: 'card_cs_compound',
    category: 'GAME',
    minigameType: 'SEQUENTIAL_GAME',
    i18nKey: 'decks:cards.cs_compound',
  },
  {
    id: 'card_frog_game',
    category: 'GAME',
    minigameType: 'SEQUENTIAL_GAME',
    i18nKey: 'decks:cards.frog_game',
  },
  {
    id: 'card_pim_pow_pam',
    category: 'GAME',
    minigameType: 'SEQUENTIAL_GAME',
    i18nKey: 'decks:cards.pim_pow_pam',
  },
  {
    id: 'card_duck_game',
    category: 'GAME',
    minigameType: 'SEQUENTIAL_GAME',
    i18nKey: 'decks:cards.duck_game',
  },

  // BENEFIT (salute)
  {
    id: 'card_salute',
    category: 'BENEFIT',
    minigameType: 'BENEFIT',
    i18nKey: 'decks:cards.salute',
  },

  // SHOWDOWN
  {
    id: 'card_eye_to_eye',
    category: 'SHOWDOWN',
    minigameType: 'SHOWDOWN',
    i18nKey: 'decks:cards.eye_to_eye',
  },
  {
    id: 'card_jokenpo',
    category: 'SHOWDOWN',
    minigameType: 'SHOWDOWN',
    i18nKey: 'decks:cards.jokenpo',
  },

  // MODIFIER
  {
    id: 'card_add_rule',
    category: 'MODIFIER',
    minigameType: 'MODIFIER',
    i18nKey: 'decks:cards.add_rule',
  },
  {
    id: 'card_remove_rule',
    category: 'MODIFIER',
    minigameType: 'MODIFIER',
    i18nKey: 'decks:cards.remove_rule',
  },

  // BENEFIT
  {
    id: 'card_shield',
    category: 'BENEFIT',
    minigameType: 'BENEFIT',
    i18nKey: 'decks:cards.shield',
  },
  {
    id: 'card_bathroom',
    category: 'BENEFIT',
    minigameType: 'BENEFIT',
    i18nKey: 'decks:cards.bathroom',
  },

  // HOT_POTATO
  {
    id: 'card_hot_potato',
    category: 'REFLEX',
    minigameType: 'HOT_POTATO',
    i18nKey: 'decks:cards.hot_potato',
  },
]
