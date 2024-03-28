import { NestFactory } from '@nestjs/core';
import {NestExpressApplication} from '@nestjs/platform-express';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers'

import { AppModule } from './app.module';
import {ConfigService} from './services/config.service';
import {loadDecks} from './utils';

const USAGE = 'Usage: $0 --cors --port [num] --games [num] --decksDir [directory] --drop'
const argv = yargs(hideBin(process.argv))
		.usage(USAGE)
		.boolean(['cors'])
		.default('port', 3000)
		.default('cors', true)
		.default('games', 10)
		.default('decksDir', '')
		.default('drop', false)
		.parse()

async function bootstrap(argv: any) {

  const PORT = argv.port

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configSvc = app.get(ConfigService)
  configSvc.argv = argv

  if (configSvc.loadDecks) {
    loadDecks(configSvc.decksDir)
  }

  if (configSvc.enableCors)
    app.enableCors()

  app.listen(PORT, () => {
    console.info(`Application started on port ${PORT} at ${new Date()}`)
    if (configSvc.enableCors)
      console.info('\tCORS enabled')
  });
}


bootstrap(argv);
