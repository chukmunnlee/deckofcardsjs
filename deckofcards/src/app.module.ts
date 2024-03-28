import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import {ConfigService} from './services/config.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [ ConfigService ],
})
export class AppModule {

  constructor(private configSvc: ConfigService) { }

  onApplicationBootstrap() {
    console.info(`Game instance: ${this.configSvc.games}`)
    console.info(`Load deck: ${this.configSvc.loadDecks}`)
  }
}
