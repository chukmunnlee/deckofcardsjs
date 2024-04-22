import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import {GamesService} from "src/services/games.service";

@Controller('/api')
export class GamesController {

  constructor(private readonly gamesSvc: GamesService) { }

  @Get('/game/:gameId')
  getGameStatusByGameId(@Param('gameId') gameId: string) {
    return this.gamesSvc.getGameStatus(gameId)
      .then(game => {
        if (!game)
          throw new NotFoundException(`Cannot find game ${gameId}`)
        return game
      })
  }
}
