import {Injectable} from "@angular/core"
import {ComponentStore} from "@ngrx/component-store"

import { GameStatus } from 'common/models/game'

export interface GameState {
  role: string
  status: GameStatus
  admin: AdminState
}

export interface AdminState {
  password: string
}

interface InitAdminValue {
  password: string
  status: GameStatus
}

const INIT_STATE: GameState = {
  role: "",
  status: {
    gameId: "", deckId: "",
    count: -1, split: -1,
    shuffle: false, replacement: false,
    piles: { },
  },
  admin: { password: "" }
}

@Injectable()
export class GameStore extends ComponentStore<GameState> {
  constructor() { super(INIT_STATE) }

  // Mutators
  readonly reset = this.updater<void>(
    (_: GameState) => (INIT_STATE)
  )

  readonly initAdmin = this.updater<InitAdminValue>(
    (_: GameState, value: InitAdminValue) => {
      return {
        role: 'admin',
        status: value.status,
        admin: { password: value.password }
      } as GameState
    }
  )

  // Queries
  readonly gameId$ = this.select<string>(
    (store: GameState) => store.status.gameId
  )

  readonly deckId$ = this.select<string>(
    (store: GameState) => store.status.deckId
  )

  readonly password$ = this.select<string>(
    (store: GameState) => !!store.admin? store.admin.password: ''
  )

  readonly isAdmin$ = this.select<boolean>(
    (store: GameState) => (!store.role? false: store.role === 'admin')
  )

  readonly dump$ = this.select<GameState>(
    (store: GameState) => store
  )

}
