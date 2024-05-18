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
  players: Player[]
  sessionKey: string
}

export interface Pile {
  name: string
  cards: Card[]
  labels?: {
    [key: string]: string | number | boolean
  }
}

export interface Player {
  name: string
  password?: string
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
