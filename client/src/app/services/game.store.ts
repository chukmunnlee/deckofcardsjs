import {Injectable} from "@angular/core"
import {ComponentStore} from "@ngrx/component-store"

import { GameStatus } from 'common/models/game'

export interface GameState {
  role: string // admin or player
  name?: string
  password: string
  players: string[]
  status: GameStatus
  sessionKey: string
}

export interface InitGameState {
  name?: string
  password: string
}

const INIT_STATE: GameState = {
  role: "",
  name: "",
  password: "",
  players: [],
  status: {
    gameId: "", deckId: "",
    count: -1, split: -1,
    shuffle: false, replacement: false,
    piles: { },
  },
  sessionKey: ""
}

@Injectable()
export class GameStore extends ComponentStore<GameState> {
  constructor() { super(INIT_STATE) }

  // Mutators
  readonly reset = this.updater<void>(
    (_: GameState) => (INIT_STATE)
  )

  readonly initAdmin = this.updater<InitGameState>(
    (state: GameState, value: InitGameState) => {
      return {
        role: 'admin',
        password: value.password,
        status: state.status,
      } as GameState
    }
  )

  readonly initPlayer = this.updater<InitGameState>(
    (state: GameState, value: InitGameState) => {
      return {
        role: 'player',
        name: value.name,
        password: value.password,
        status: state.status,
      } as GameState
    }
  )

  readonly updateStatus = this.updater<GameStatus>(
    (state: GameState, status: GameStatus) => {
      return { ...state, status }
    }
  )

  readonly updateSessionKey = this.updater<string>(
    (state: GameState, sessionKey: string) => ({
      ...state, sessionKey
    })
  )

  // Use with caution, only for players in waiting state
  readonly setGameId = this.updater<string>(
    (state: GameState, gameId: string) => {
      return { ...state, status: { ...state.status, gameId }  }
    }
  )

  readonly updatePlayers = this.updater<string[]>(
    (state: GameState, players: string[]) => {
      return { ...state, players }
    }
  )

  readonly removePlayer = this.updater<string>(
    (state: GameState, player: string) => {
      return { ...state, players: state.players.filter(p => p != player) }
    }
  )

  // Queries
  readonly gameId$ = this.select<string>(
    (store: GameState) => store.status.gameId
  )

  readonly deckId$ = this.select<string>(
    (store: GameState) => store.status.deckId
  )

  readonly name$ = this.select<string>(
    (store: GameState) => !!store.name? store.name: ''
  )

  readonly password$ = this.select<string>(
    (store: GameState) => store.password
  )

  readonly isAdmin$ = this.select<boolean>(
    (store: GameState) => (!store.role? false: store.role === 'admin')
  )

  readonly players$ = this.select<string[]>(
    (store: GameState) => store.players
  )

  readonly dump$ = this.select<GameState>(
    (store: GameState) => store
  )

}
