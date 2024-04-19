import {Card} from "./deck"

export interface DeckBackImageResponse {
  backImage: string
}

export interface CreateGameResponse {
  gameId: string 
  password: string
}

export interface PatchGameDrawCardResponse {
  pileName: string
  remaining: number
  drawn: Card[]
}

export interface GetPileNamesByGameIdResponse {
  gameId: string
  piles: { pileName: string, remaining: number }[]
}

export interface HealthzResponse {
	timestamp: number 
	decks: number
}

export interface ReadyResppnse {
	timestamp: number 
}
