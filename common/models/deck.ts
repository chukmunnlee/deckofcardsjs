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
  cards: Card[]
}

export interface Deck extends Resource {
  spec: DeckSpec
}

export interface DeckSummary {
  deckId: string
  name: string
  description?: string
}
