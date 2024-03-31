export interface ResponseBase {
  success: boolean
}

export interface DeckBackImageResponse extends ResponseBase {
  backImage: string
}

export interface CreateGameResponse extends ResponseBase {
  gameId: string 
  password: string
}
