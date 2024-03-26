import { NestFactory } from '@nestjs/core';
import {NestExpressApplication} from '@nestjs/platform-express';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers'

import { AppModule } from './app.module';

async function bootstrap(argv: any) {

  const PORT = argv.port

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  if (argv.cors)
    app.enableCors()

  app.listen(PORT, () => {
    console.info(`Application started on port ${PORT} at ${new Date()}`)
    if (argv.cors)
      console.info('\tCORS enabled')
  });
}

const argv = yargs(hideBin(process.argv))
		.usage('Usage: $0 --cors --port [num] --games [num]')
		.boolean(['cors'])
		.default('port', 3000)
		.default('cors', true)
		.default('games', 10)
		.parse()

bootstrap(argv);
