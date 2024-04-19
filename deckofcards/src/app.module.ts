import { Module } from '@nestjs/common';

import {DecksRepository} from './repositories/decks.repository';

import {ConfigService} from './services/config.service';
import {DecksService} from './services/decks.service';

import { DecksController } from './controllers/decks.controller';
import {GamesController} from './controllers/games.controller';
import { ProbesController } from './controllers/probes.controller';
import {GamesRepository} from './repositories/games.repository';
import {GamesService} from './services/games.service';
import {PilesService} from './services/piles.service';
import {PilesController} from './controllers/piles.controller';

@Module({
  imports: [],
  controllers: [ DecksController, GamesController, PilesController, ProbesController],
  providers: [ ConfigService, DecksService, GamesService, PilesService
      , DecksRepository, GamesRepository ],
})
export class AppModule {
}
