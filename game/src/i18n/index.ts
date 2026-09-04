import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enUSCommon from '@/i18n/locales/en-US/common.json'
import enUSDecks from '@/i18n/locales/en-US/decks.json'
import enUSHowToPlay from '@/i18n/locales/en-US/how-to-play.json'
import esESCommon from '@/i18n/locales/es-ES/common.json'
import esESDecks from '@/i18n/locales/es-ES/decks.json'
import esESHowToPlay from '@/i18n/locales/es-ES/how-to-play.json'
import ptBRCommon from '@/i18n/locales/pt-BR/common.json'
import ptBRDecks from '@/i18n/locales/pt-BR/decks.json'
import ptBRHowToPlay from '@/i18n/locales/pt-BR/how-to-play.json'

const resources = {
  'pt-BR': {
    common: ptBRCommon,
    decks: ptBRDecks,
    howToPlay: ptBRHowToPlay,
  },
  'en-US': {
    common: enUSCommon,
    decks: enUSDecks,
    howToPlay: enUSHowToPlay,
  },
  'es-ES': {
    common: esESCommon,
    decks: esESDecks,
    howToPlay: esESHowToPlay,
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'pt-BR',
  fallbackLng: 'pt-BR',
  ns: ['common', 'decks', 'howToPlay'],
  defaultNS: 'common',
  compatibilityJSON: 'v3',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
