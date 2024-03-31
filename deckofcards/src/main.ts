import { NestFactory } from '@nestjs/core';
import {NestExpressApplication} from '@nestjs/platform-express';
import * as morgan from 'morgan';

import { AppModule } from './app.module';
import {ConfigService} from './services/config.service';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configSvc = app.get(ConfigService)
  const PORT = configSvc.port

  if (configSvc.enableCors)
    app.enableCors()

  app.disable('x-powered-by')
  app.use(morgan('combined'))

  app.listen(PORT, () => {
    console.info(`Application started on port ${PORT} at ${new Date()}`)
    if (configSvc.enableCors)
      console.info('\tCORS enabled')
  });
}


bootstrap();
