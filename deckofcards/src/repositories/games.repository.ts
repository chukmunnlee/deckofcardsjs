import {HttpException, Injectable} from "@nestjs/common";

import {Collection, MongoClient} from "mongodb";
import {Game} from "common/models/game";

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

  getGameCount(): Promise<number> {
    return this.games.countDocuments()
  }

}
