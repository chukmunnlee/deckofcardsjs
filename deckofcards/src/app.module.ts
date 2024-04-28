import {join} from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers'

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
import {ServeStaticModule} from '@nestjs/serve-static';

const args: any = yargs(hideBin(process.argv))
  .default('staticDir', process.env.STATIC_DIR || '../static')
  .parse()

const rootPath = args.staticDir.startsWith('/')? args.staticDir: join(__dirname, args.staticDir)

@Module({
  imports: [ ServeStaticModule.forRoot({ rootPath }) ],
  controllers: [ DecksController, GamesController, PilesController, ProbesController],
  providers: [ ConfigService, DecksService, GamesService, PilesService
      , DecksRepository, GamesRepository ],
})
export class AppModule {
}
