import { NestFactory } from '@nestjs/core';
import {NestExpressApplication} from '@nestjs/platform-express';

import { AppModule } from './app.module';
import {ConfigService} from './services/config.service';
import {loadDecks, createDatabaseConnection } from './utils';
import {DecksService} from './repositories/decks';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configSvc = app.get(ConfigService)
  const decksSvc = app.get(DecksService)
  const PORT = configSvc.port

  const client = createDatabaseConnection(configSvc.mongodbUri)
  decksSvc.client = client

  if (configSvc.loadDecks) {
    const decks = loadDecks(configSvc.decksDir)
    let p: Promise<any>
    if (configSvc.drop)
      p = decksSvc.drop()
        .then(() => decksSvc.load(decks))
    else
      p =decksSvc.load(decks)

    p.then(result => console.info('Decks loaded: ', result.insertedCount ))
     .catch((err: any) => {
        console.error('Cannot load decks\n', err)
        process.exit(-1)
     })
  }

  if (configSvc.enableCors)
    app.enableCors()

  app.listen(PORT, () => {
    console.info(`Application started on port ${PORT} at ${new Date()}`)
    if (configSvc.enableCors)
      console.info('\tCORS enabled')
  });
}


bootstrap();
