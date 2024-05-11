import Dixie, { Table } from 'dexie'

export const WAIT_GAME = 'Wait-Game' // admin waiting to start
export const WAIT_START = 'Wait-Start' // player waiting to start
export const ADMIN_START = 'Admin-Start' // admin started
export const PLAYER_START = 'Player-Start' // player started
export type GameStage = 'Wait-Start' | 'Wait-Game' | 'Admin-Start' | 'Player-Start'

export interface RunningGame {
  deckId: string
  deckName: string
  gameId: string
  password: string
  sessionKey: string
  name: string
  admin: boolean
  stage: GameStage
  createdOn: number
}

export class GameRepository extends Dixie {

  private games!: Table<RunningGame, string>

  constructor() {
    super('deckofcards')
    this.version(1).stores({
      games: 'gameId, createdOn'
    })
    this.games = this.table('games')
  }

  addGameAsAdmin(game: RunningGame) {
    return this.games.add(game)
  }

  addGameAsPlayer(game: RunningGame) {
    return this.games.add(game)
  }

  updateGame(gameId: string, values: {}) {
    return this.games.update(gameId, values)
  }

  getGameById(gameId: string): Promise<RunningGame | undefined> {
    return this.games.get(gameId)
  }

  deleteGameById(gameId: string) {
    return this.games.delete(gameId)
  }

  getGames(): Promise<RunningGame[]> {
    return this.games
      .orderBy('createdOn').reverse().toArray()
  }

}
