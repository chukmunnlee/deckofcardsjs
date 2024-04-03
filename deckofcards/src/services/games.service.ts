import { Injectable} from "@nestjs/common";
import {GameStatus} from "common/models/game";
import {DecksRepository} from "src/repositories/decks.repository";
import {GamesRepository} from "src/repositories/games.repository";

@Injectable()
export class GamesService {

  constructor(private readonly decksRepo: DecksRepository
      , private readonly gamesRepo: GamesRepository) { }

  getGameStatus(gameId: string) {
    return this.gamesRepo.getGameById(gameId)
      .then(game => {
        if (!game)
          return undefined
        const gameStatus: GameStatus = {
          gameId: game.gameId,
          deckId: game.deckId,
          count: game.count,
          split: game.split,
          shuffle: game.shuffle, 
          replacement: game.replacement,
          piles: {}
        }
        for (let p in game.piles)
          gameStatus.piles[p] = game.piles[p].cards.length
        return gameStatus
      })
  }
}
