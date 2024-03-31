import {Injectable, OnModuleInit} from "@nestjs/common";
import {DecksRepository} from "src/repositories/decks.repository";

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers'

import {loadDecks, createDatabaseConnection } from '../utils';
import {GamesRepository} from "src/repositories/games.repository";

const USAGE = 'Usage: $0 --cors --port [num] --games [num] --decksDir [directory] --drop --mongodbUri [string]'

@Injectable()
export class ConfigService implements OnModuleInit {

  argv: any = null;

  private _ready = false

  constructor(private readonly decksRepo: DecksRepository
      , private readonly gamesRepo: GamesRepository) {
    this.argv = yargs(hideBin(process.argv))
		.usage(USAGE)
		.boolean(['cors', 'drop'])
		.default('port', parseInt(process.env.PORT) || 3000)
		.default('cors', process.env.CORS)
		.default('games', parseInt(process.env.GAMES) || 10)
		.default('decksDir', process.env.DECKS_DIR || '')
		.default('drop', !!process.env.DROP)
		.default('mongodbUri', process.env.MONGODB_URI || 'mongodb://localhost:27017/deckofcards')
		.parse()
  }

  get games() { return this.argv.games }
  get loadDecks() { return !!this.argv.decksDir }
  get decksDir() { return this.argv.decksDir }
  get drop() { return this.argv.drop }
  get enableCors() { return this.argv.cors }
  get port() { return this.argv.port }
  get mongodbUri() { return this.argv.mongodbUri }
  get ready() { return this._ready }

  onModuleInit() {

    const client = createDatabaseConnection(this.mongodbUri)
    this.decksRepo.client = client
    this.gamesRepo.client = client

    if (this.loadDecks) {
      const decks = loadDecks(this.decksDir)
      let p: Promise<any>
      if (this.drop)
        p = this.decksRepo.drop()
          .then(() => this.decksRepo.load(decks))
      else
        p = this.decksRepo.load(decks)

      p.then(result => {
        console.info('Decks loaded: ', result.insertedCount )
        this._ready = true
      })
      .catch((err: any) => {
          console.error('Cannot load decks\n', err)
          process.exit(-1)
       })
    } else
      this._ready = true
  }

}
