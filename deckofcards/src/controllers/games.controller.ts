import { Controller, Delete, Get, NotFoundException, Param, Headers, Req } from "@nestjs/common";
import {Request} from "express";

import * as qr from 'qrcode'

import {DeleteGameResponse, GetGameQRCodeResponse} from "common/models/response";
import {GamesService} from "src/services/games.service";

@Controller('/api')
export class GamesController {

  constructor(private readonly gamesSvc: GamesService) { }

  @Get('/game/:gameId/qr')
  getGameQRByGameId(@Param('gameId') gameId: string,
      @Headers('Host') host: string, @Req() req: Request) {

    const proto = req.secure? 'https': 'http'

    const url = `${proto}://${host}/#/join-game/${gameId}`

    return qr.toDataURL(url)
        .then(image => ({ url, image } as GetGameQRCodeResponse))
  }

  @Get('/game/:gameId')
  getGameStatusByGameId(@Param('gameId') gameId: string) {
    return this.gamesSvc.getGameStatus(gameId)
      .then(game => {
        if (!game)
          throw new NotFoundException(`Cannot find game ${gameId}`)
        return game
      })
  }

  @Delete('/game/:gameId')
  deleteGameByGameId(@Param('gameId') gameId: string
      , @Headers('X-Game-Password') password: string = 'abc') {
    return this.gamesSvc.deleteGame(gameId, password)
        .then(() => ({ gameId } as DeleteGameResponse))
  }
}
