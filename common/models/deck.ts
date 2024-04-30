import {Resource} from "./resource"

export interface Card {
  code: string
  image: string
  images: { [ key: string ]: string }[]
  suit: string
  value: string
  count?: number
}

export interface DeckSpec {
  backImage: string
  presets?: DeckPresets
  cards: Card[]
}

export interface DeckPresets {
  count?: number
  split?: number
  shuffle?: boolean
  replacement?: boolean
  [ feature: string ]: any
}

export interface Deck extends Resource {
  spec: DeckSpec
}

export interface DeckSummary {
  deckId: string
  name: string
  description?: string
  presets: DeckPresets
}

export interface GetDeckDescriptionByGameId {
  gameId: string
  deckId: string
  name: string
  description: string
}
