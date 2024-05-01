import {Injectable} from "@angular/core"
import {ComponentStore} from "@ngrx/component-store"

import { GameStatus } from 'common/models/game'

export interface GameState {
  role: string // admin or player
  name?: string
  password: string
  status: GameStatus
}

export interface InitGameState {
  name?: string
  password: string
}

const INIT_STATE: GameState = {
  role: "",
  name: "",
  password: "",
  status: {
    gameId: "", deckId: "",
    count: -1, split: -1,
    shuffle: false, replacement: false,
    piles: { },
  }
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

  // Use with caution, only for players in waiting state
  readonly setGameId = this.updater<string>(
    (state: GameState, gameId: string) => {
      return { ...state, status: { ...state.status, gameId }  }
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

  readonly dump$ = this.select<GameState>(
    (store: GameState) => store
  )

}
