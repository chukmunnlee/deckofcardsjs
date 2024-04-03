export interface DeckBackImageResponse {
  backImage: string
}

export interface CreateGameResponse {
  gameId: string 
  password: string
}

export interface HealthzResponse {
	timestamp: number 
	decks: number
}

export interface ReadyResppnse {
	timestamp: number 
}
