import { BadRequestException, Body, Controller, Get, Header, HttpCode, HttpStatus, NotFoundException, Param, Post } from '@nestjs/common';

import { DeckSummary } from 'src/models/deck'
import {PostDeckById} from 'src/models/request';
import {CreateGameResponse, DeckBackImageResponse} from 'src/models/response';
import {DecksRepository} from 'src/repositories/decks.repository';
import {DecksService} from 'src/services/decks.service';

@Controller('/api')
export class DecksController {

  constructor(private readonly decksRepo: DecksRepository, private readonly deckSvc: DecksService) { }

  @Get('/decks')
  getDecks(): Promise<DeckSummary[]> {
    return this.decksRepo.getDecksSummary()
  }

  @Get('/deck/:deckId')
  getDeckById(@Param('deckId') deckId: string) {
    return this.decksRepo.findDeckById(deckId, new NotFoundException(`Cannot find deckId = ${deckId}`))
  }

  @Get('/deck/:deckId/back')
  @Header('Cache-Control', 'public,max-age=3600')
  getBackImageById(@Param('deckId') deckId: string) {
    return this.decksRepo.getBackImageById(deckId, new NotFoundException(`Cannot find deckId = ${deckId}`))
        .then(backImage => ({ success: true, backImage } as DeckBackImageResponse))
  }

  @Post('/deck')
  @HttpCode(HttpStatus.CREATED)
  postDeckById(@Body() form: PostDeckById) {
    console.info('>>> form: ', form)
    return this.deckSvc.createGame(form)
        .then(game => (
          { success: true, gameId: game.gameId, password: game.password } as CreateGameResponse)
        )
        .catch(err => { throw new BadRequestException(err) })
  }
}