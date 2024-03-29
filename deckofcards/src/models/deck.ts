import {Resource} from "./resource"

export interface Card {
  suit: string
  value: string
  code: string
  image: string
  images: { [ key: string ]: string }[]
}

export interface DeckSpec {
  backImage: string
  cards: Card[]
}

export interface Deck extends Resource {
  spec: DeckSpec
}

