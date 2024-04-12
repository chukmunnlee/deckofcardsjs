import {BadRequestException, Body, Controller, Get, NotFoundException, Param, Patch } from "@nestjs/common";
import { PatchGameDrawCard} from "common/models/request";
import {GamesService} from "src/services/games.service";

@Controller('/api')
export class GamesController {

  constructor(private readonly gamesSvc: GamesService) { }

  @Get('/game/:gameId/status')
  getGame(@Param('gameId') gameId: string) {
    return this.gamesSvc.getGameStatus(gameId)
      .then(game => {
        if (!game)
          throw new NotFoundException(`Cannot find game ${gameId}`)
        return game
      })
  }

  @Patch('/game/:gameId')
  patchGame(@Param('gameId') gameId: string, @Body() gameRequest: PatchGameDrawCard) {
    let patchReq: PatchGameDrawCard = {
      count: 1, pileName: 'pile0', location: 'top', positions: [], codes: []
    }

    if (!!gameRequest)
      patchReq = { ...patchReq, ...gameRequest } 

    return this.gamesSvc.drawCard(gameId, patchReq)
        .catch(error => {
          throw new BadRequestException(error)
        })
  }
}
