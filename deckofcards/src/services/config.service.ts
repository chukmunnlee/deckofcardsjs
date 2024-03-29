import {Injectable} from "@nestjs/common";

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers'

const USAGE = 'Usage: $0 --cors --port [num] --games [num] --decksDir [directory] --drop --mongodbUri [string]'

@Injectable()
export class ConfigService {

  argv: any = null;

  constructor() {
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

}
