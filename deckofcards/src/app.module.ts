import { Module } from '@nestjs/common';

import {DecksRepository} from './repositories/decks.repository';

import {ConfigService} from './services/config.service';
import {DecksService} from './services/decks.service';

import { DecksController } from './controllers/decks.controller';
import { ProbesController } from './controllers/probes.controller';
import {GamesRepository} from './repositories/games.repository';

@Module({
  imports: [],
  controllers: [ DecksController, ProbesController],
  providers: [ ConfigService, DecksRepository, DecksService, GamesRepository ],
})
export class AppModule {
}
