export interface PostDeckById {
  shuffle?: boolean
  replacement?: boolean
  count: number
  split?: number
  deckId?: string
  name?: string
}

export interface PatchGameDrawCard {
  // defaults to pile1
  count?: number
  // defaults to pile0
  pileName?: string
  // default to top, bottom, random
  location?: string
  // take precedence over location
  position?: number
}
