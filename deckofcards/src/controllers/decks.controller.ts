import { BadRequestException, Body, Controller, Get, Header, HttpCode, HttpStatus, NotFoundException, Param, Post, Query } from '@nestjs/common';

import { DeckSummary } from 'common/models/deck'
import {PostDeckById} from 'common/models/request';
import {CreateGameResponse, DeckBackImageResponse} from 'common/models/response';
import {DecksRepository} from 'src/repositories/decks.repository';
import {DecksService} from 'src/services/decks.service';

@Controller('/api')
export class DecksController {

  constructor(private readonly decksRepo: DecksRepository, private readonly deckSvc: DecksService) { }

  @Get('/decks')
  getDecks(): Promise<DeckSummary[]> {
    return this.decksRepo.getDecksSummary()
  }

  @Get('/deck/:deckId/cards')
  getDeckByDeckId(@Param('deckId') deckId: string, @Query('codes') codes: string = undefined
      , @Query('codesOnly') codesOnly = undefined) {

    //const simple = toBoolean(codesOnly)

    return this.decksRepo.findDeckById(deckId, new NotFoundException(`Cannot find deckId = ${deckId}`))
      .then(deck => {
        if (!codes)
          return deck
        const values = codes.toLowerCase().split(',')
        deck.spec.cards = deck.spec.cards.filter(card => values.indexOf(card.code.toLowerCase()) >= 0)
        return deck
      })
  }

  @Get('/deck/:deckId/presets')
  getDeckPresetsByDeckId(@Param('deckId') deckId: string) {
    return this.decksRepo.getDeckPresets(deckId)
  }

  @Get('/deck/:deckId/back')
  @Header('Cache-Control', 'public,max-age=3600')
  getBackImageByDeckId(@Param('deckId') deckId: string) {
    return this.decksRepo.getBackImageById(deckId, new NotFoundException(`Cannot find deckId = ${deckId}`))
        .then(backImage => ({ backImage } as DeckBackImageResponse))
  }

  @Post('/deck')
  @HttpCode(HttpStatus.CREATED)
  postDeck(@Body() payload: PostDeckById) {
    return this.deckSvc.createGame(payload)
        .then(game => (
          { gameId: game.gameId, password: game.password } as CreateGameResponse)
        )
        .catch(err => { throw new BadRequestException(err) })
  }
}
