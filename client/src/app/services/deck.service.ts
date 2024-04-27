import {Injectable, inject} from "@angular/core";
import {HttpClient} from "@angular/common/http";

import {PostDeckById} from "common/models/request";
import {CreateGameResponse} from "common/models/response";

import { DeckSummary } from 'common/models/deck'
import {firstValueFrom} from "rxjs";

@Injectable()
export class DeckService {

  private readonly http = inject(HttpClient)

  public getDecks(): Promise<DeckSummary[]> {
    return firstValueFrom(
      this.http.get<DeckSummary[]>('/api/decks')
    )
  }

  public createGame(req: PostDeckById) {
    return firstValueFrom(
      this.http.post<CreateGameResponse>('/api/deck', req)
    )
  }
}
