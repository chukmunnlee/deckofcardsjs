import {Body, Controller, Get, Param, Patch, BadRequestException, Headers, Query, NotFoundException} from "@nestjs/common";
import { PatchGameDrawCard} from "common/models/request";
import {GetPileNamesByGameIdResponse, GetPilesByGameIdResponse } from "common/models/response";
import {GamesService} from "src/services/games.service";
import {PilesService} from "src/services/piles.service";
import {toBoolean, toString} from "src/utils";

@Controller('/api')
export class PilesController {

  constructor(private readonly pilesSvc: PilesService, private readonly gamesSvc: GamesService) { }

  @Get('/game/:gameId/piles')
  public getPilesByGameId(@Param('gameId') gameId: string, @Query('full') full = undefined
      , @Headers('X-Game-Password') password: string = undefined) {

    //full = toBoolean(full)
    full = toBoolean(full)
    password = toString(password)

    if (!!password)
      return this.pilesSvc.getPilesContentByGameId(gameId, password
          , new NotFoundException(`Cannot find game: ${gameId}`))
        .then(piles => ({ gameId, piles } as GetPilesByGameIdResponse))

    return this.pilesSvc.getPileNamesByGameId(gameId)
        // @ts-ignore
        .then(piles => ({ gameId, piles } as GetPileNamesByGameIdResponse))
  }

  @Get('/game/:gameId/pile')
  public getPileByGameId(@Param('gameId') gameId: string, @Query('full') full = undefined
      , @Headers('X-Game-Password') password: string = undefined) {
    return this.getPileByNameByGameId(gameId, 'pile0', full, password)
  }

  @Get('/game/:gameId/pile/:pileName')
  public getPileByNameByGameId(@Param('gameId') gameId: string, @Param('pileName') pileName: string
      , @Query('full') full = undefined, @Headers('X-Game-Password') password: string = undefined) {

    full = toBoolean(full)
    password = toString(password)

    if (!!password)
      return this.pilesSvc.getPileContentByNameByGameId(gameId, pileName, password
          , new NotFoundException(`Cannot find game: ${gameId}`))
        .then(piles => ({ gameId, piles } as GetPilesByGameIdResponse))

    return this.pilesSvc.getPileNamesByGameId(gameId)
        .then(piles => (
          {
            gameId,
            piles: piles.filter(v => pileName === v.pileName)
          } as GetPileNamesByGameIdResponse 
        ))
  }

  @Patch('/game/:gameId/pile/shuffle')
  patchGameByGameIdShuffle(@Param('gameId') gameId: string) {
    return this.patchGameByGameIdPileShuffle(gameId, 'pile0')
  }

  @Patch('/game/:gameId/pile/:pileName/shuffle')
  patchGameByGameIdPileShuffle(@Param('gameId') gameId: string, @Param('pileName') pileName: string) {
    return this.pilesSvc.shufflePile(gameId, pileName
        , new BadRequestException(`Cannot shuffle ${pileName} pile in game ${gameId}`))
        .then(result => {
          if (!result)
            throw new BadRequestException(`Cannot shuffle ${pileName} pile in game ${gameId}`)
          return { result }
        })
  }

  // Draw from the main pile
  @Patch('/game/:gameId/pile')
  patchGameByGameId(@Param('gameId') gameId: string, @Body() gameRequest: PatchGameDrawCard) {
    return this.patchGameByGameIdFromTo(gameId, 'pile0', 'discarded', gameRequest)
  }

  @Patch('/game/:gameId/pile/:srcPile')
  patchGameByGameIdFrom(@Param('gameId') gameId: string, @Param('srcPile') srcPile: string
      , @Body() gameRequest: PatchGameDrawCard) {
    return this.patchGameByGameIdFromTo(gameId, srcPile, 'discarded', gameRequest)
  }

  @Patch('/game/:gameId/pile/:srcPile/:dstPile')
  patchGameByGameIdFromTo(@Param('gameId') gameId: string
      , @Param('srcPile') srcPile: string, @Param('dstPile') dstPile: string
      , @Body() gameRequest: PatchGameDrawCard) {

    let patchReq: PatchGameDrawCard = {
      count: 1, location: 'top', positions: [], codes: []
    }

    if (!!gameRequest)
      patchReq = { ...patchReq, ...gameRequest } 

    return this.gamesSvc.drawCard(gameId, srcPile, dstPile, patchReq)
        .catch(error => {
          throw new BadRequestException(error)
        })
  }
}
