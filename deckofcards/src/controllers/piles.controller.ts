import {Controller, Get, Param} from "@nestjs/common";
import {GetPileNamesByGameIdResponse} from "common/models/response";
import {PilesService} from "src/services/piles.service";

@Controller('/api')
export class PilesController {

  constructor(private readonly pilesSvc: PilesService) { }

  @Get('/game/:gameId/piles')
  public getPilesByGameId(@Param('gameId') gameId: string) {
    return this.pilesSvc.getPileNamesByGameId(gameId)
        // @ts-ignore
        .then(piles => ({ gameId, piles } as GetPileNamesByGameIdResponse))
  }
}
