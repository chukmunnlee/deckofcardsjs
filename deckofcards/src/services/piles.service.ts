import { HttpException, Injectable} from "@nestjs/common";
import { GetPilesByGameIdResponse} from "common/models/response";
import {GamesRepository} from "src/repositories/games.repository";

@Injectable()
export class PilesService {

  constructor(private readonly gamesRepo: GamesRepository) { }

  public getPileNamesByGameId(gameId: string) {
    return this.gamesRepo.getPileStatusByGameId(gameId)
    /*
    return this.gamesRepo.getPileNamesByGameId(gameId)
        .then(pileNames => (
          { gameId, pileNames } as GetPileNamesByGameIdResponse
        ))
    */
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
