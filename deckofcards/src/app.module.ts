import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import {ConfigService} from './services/config.service';
import {DecksService} from './repositories/decks';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [ ConfigService, DecksService ],
})
export class AppModule {

}
