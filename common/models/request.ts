export interface PostDeckById {
  shuffle?: boolean
  replacement?: boolean
  count?: number
  split?: number
  deckId?: string
  name?: string
}

export interface PostJoinGame {
	gameId: string
	name: string
}

export interface PileAttribute {
 [key: string]: string | number | boolean
}

export interface PatchGameDrawCard {
  // defaults to 1
  count?: number
  // default to top, other valid locations: bottom, random
  location?: string
  // draw cards by position, takes precedence over location
  positions?: number[]
  // draw cards by code, takes precedence over position
  codes?: string[]
}

export interface PatchJoinGameByPlayer {
  name: string
}
