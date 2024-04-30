import {Card} from "./deck"

export interface Game {
  gameId: string
  deckId: string
  piles: { [ key: string ]: Pile }
  count: number
  split: number
  shuffle: boolean
  replacement: boolean
  createdOn: number
  lastUpdate: number
  password: string
  started: boolean
}

export interface Pile {
  name: string
  cards: Card[]
}

export interface GameStatus {
  gameId: string
  deckId: string
  piles: { [ key: string ]: number }
  count: number
  split: number
  shuffle: boolean, 
  replacement: boolean
}
