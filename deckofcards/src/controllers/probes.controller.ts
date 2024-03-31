import { Controller, Get, HttpCode, HttpStatus, ServiceUnavailableException } from '@nestjs/common';
import {ConfigService} from 'src/services/config.service';

@Controller()
export class ProbesController {

  constructor(private readonly configSvc: ConfigService) { }

  @Get('/ready')
  @HttpCode(HttpStatus.OK)
  ready() {
    if (this.configSvc.ready)
      return { timestamp: (new Date()).getTime() }

    throw new ServiceUnavailableException('Service is not ready')
  }
}
