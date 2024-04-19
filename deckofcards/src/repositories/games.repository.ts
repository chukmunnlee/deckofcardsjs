import {HttpException, Injectable} from "@nestjs/common";

import {Collection, MongoClient} from "mongodb";
import {Game} from "common/models/game";
import {Card} from "common/models/deck";

@Injectable()
export class GamesRepository {

  private games: Collection<Game>

  set client(_client: MongoClient) {
    this.games = _client.db().collection<Game>('games')
  }

  createGame(game: Game, ex: HttpException = null) {
    // @ts-ignore
    return this.games.insertOne({ _id: game.gameId, ...game })
  }

  getGameById(gameId: string): Promise<Game> {
    // @ts-ignore
    return this.games.findOne({ _id: gameId })
  }

  getGameCount(): Promise<number> {
    return this.games.countDocuments()
  }

  getPileNamesByGameId(gameId: string): Promise<string[]> {
    return this.getGameById(gameId)
        .then(game => !!game? Object.keys(game.piles): [])
  }

  getPileStatusByGameId(gameId: string) {
    return this.getGameById(gameId)
        .then(game => {
          if (!game)
            return [];
          return Object.entries(game.piles)
            .map(value => ({ 
              pileName: value[0],
              remaining: game.piles[value[0]].cards.length 
            }))
        })
  }

  updatePiles(gameId: string, pileName: string, remain: Card[], drawn: Card[]) {
    const updatePile = `piles.${pileName}.cards`
    return this.games.updateOne(
      { gameId }, 
      { 
        $push: { "piles.discarded.cards": { $each: drawn } },
         $set: { [ updatePile ] : remain }  
      }
    ).then(result => result.modifiedCount > 0)
  }

}
