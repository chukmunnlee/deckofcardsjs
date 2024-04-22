import { HttpException, Injectable} from "@nestjs/common";
import {GamesRepository} from "src/repositories/games.repository";
import {shuffle} from "src/utils";

@Injectable()
export class PilesService {

  constructor(private readonly gamesRepo: GamesRepository) { }

  public async shufflePile(gameId: string, pileName: string, ex: HttpException = undefined) {
    const game = await this.gamesRepo.getGameById(gameId)
    if (!(!!game && (pileName in game.piles))) {
      if (!ex)
        return undefined
      throw ex
    }

    const cards = game.piles[pileName].cards
    shuffle(cards)

    return this.gamesRepo.updatePile(gameId, pileName, cards)
  }

  public getPileNamesByGameId(gameId: string) {
    return this.gamesRepo.getPileStatusByGameId(gameId)
  }

  public getPileContentByNameByGameId(gameId: string, pileName: string, password: string
      , ex: HttpException = undefined) {
    return this.gamesRepo.getPileContentByNameByGameId(gameId, pileName, password)
        .then(piles => {
          if (!!piles) 
            return piles
            //return { gameId, piles: _piles } as GetPilesByGameIdResponse
          if (!ex)
            return undefined
          throw ex
        })
  }

  public getPilesContentByGameId(gameId: string, password: string, ex: HttpException = undefined) {
    return this.gamesRepo.getPilesContentByGameId(gameId, password)
        .then(piles => {
          if (!!piles)
            return piles
          if (!ex)
            return undefined
          throw ex
        })
  }
}
