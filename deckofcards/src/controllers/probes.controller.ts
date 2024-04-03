import { BadRequestException, Controller, Get, HttpCode, HttpStatus, ServiceUnavailableException } from '@nestjs/common';
import {HealthzResponse, ReadyResppnse} from 'common/models/response';
import {DecksRepository} from 'src/repositories/decks.repository';
import {ConfigService} from 'src/services/config.service';

@Controller()
export class ProbesController {

  constructor(private readonly configSvc: ConfigService
      , private readonly decksRepo: DecksRepository) { }

  @Get('/ready')
  @HttpCode(HttpStatus.OK)
  ready() {
    if (this.configSvc.ready)
      return { timestamp: (new Date()).getTime() } as ReadyResppnse

    throw new ServiceUnavailableException('Service is not ready')
  }

  @Get('/healthz')
  @HttpCode(HttpStatus.OK)
  healthz() {
    return this.decksRepo.countDecks()
        .then(count => (
          { timestamp: (new Date()).getTime(), decks: count } as HealthzResponse
        ))
        .catch(err => {
          throw new BadRequestException(`Not ready: ${JSON.stringify(err)}`)
        })

  }
}
