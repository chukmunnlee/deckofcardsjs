import { Injectable} from "@nestjs/common";
import {GetPileNamesByGameIdResponse} from "common/models/response";
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

}
