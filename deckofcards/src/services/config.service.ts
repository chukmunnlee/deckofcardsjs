import {Injectable} from "@nestjs/common";

@Injectable()
export class ConfigService {

  argv: any = null;

  get games() { return this.argv?.games || 10 }
  get loadDecks() { return !!this.argv?.decksDir }
  get decksDir() { return this.argv?.decksDir }
  get drop() { return this.argv?.drop }
  get enableCors() { return this.argv?.cors }

}
