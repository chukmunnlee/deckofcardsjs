import {Body, Controller, Get, NotFoundException, Param, Patch } from "@nestjs/common";
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
    let patchReq: PatchGameDrawCard
    if (!gameRequest)
      patchReq = { 
        count: 1,
        pileName: 'pile0',
        location: 'top'
      } 
    else 
      patchReq = {
        count: 1,
        pileName: 'pile0',
        location: 'top',
        ...gameRequest
      }

  }

}