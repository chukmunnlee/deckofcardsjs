import { Controller, Delete, Get, NotFoundException, Param, Headers, Req, Post, Body, BadRequestException, Query } from "@nestjs/common";
import {Request} from "express";

import * as qr from 'qrcode'

import {DeleteGameResponse, GetGameQRCodeResponse, LeaveGameResponse} from "common/models/response";
import {GamesService} from "src/services/games.service";
import {Player} from "common/models/game";

@Controller('/api')
export class GamesController {

  constructor(private readonly gamesSvc: GamesService) { }

  @Post('/game/:gameId/player')
  postGamePlayerByGameId(@Param('gameId') gameId: string, @Body() player: Player) {
    return this.gamesSvc.joinGame(gameId, player.name)
  }

  @Delete('/game/:gameId/player')
  deleteGamePlayerByGameId(@Param('gameId') gameId: string
      , @Query() player: Player , @Headers('X-Game-Password') password: string = 'abc') {
    console.info('>>> player: ', player)
    return this.gamesSvc.leaveGame(gameId, { name: player.name, password })
        .then(result => (
          { gameId, name: player.name } as LeaveGameResponse
        ))
  }

  @Get('/game/:gameId/players')
  getPlayersByGameId(@Param('gameId') gameId: string) {
    return this.gamesSvc.getPlayersByGameId(gameId)
  }

  @Get('/game/:gameId/qr')
  getGameQRByGameId(@Param('gameId') gameId: string,
      @Headers('Host') host: string, @Req() req: Request) {

    const proto = req.secure? 'https': 'http'

    return this.gamesSvc.getDeckDescriptionFromId(gameId)
        .then(result => {
          const url = `${proto}://${host}/#/join-game/${gameId}?name=${result.name}`
          return qr.toDataURL(url)
              .then(image => ({ url, image } as GetGameQRCodeResponse))
        })
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
