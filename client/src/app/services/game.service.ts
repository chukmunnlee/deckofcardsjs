import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable, inject} from "@angular/core";
import {GameStatus} from "common/models/game";
import {DeleteGameResponse} from "common/models/response";
import {firstValueFrom} from "rxjs";

@Injectable()
export class GameService {
  readonly http = inject(HttpClient)

  getGameStatusById(gameId: string) {
    return firstValueFrom(
      this.http.get<GameStatus>(`/api/game/${gameId}`)
    )
  }

  deleteGameById(gameId: string, password: string) {
    const headers = new HttpHeaders()
        .set('X-Game-Password', password)
    return firstValueFrom(
      this.http.delete<DeleteGameResponse>(`/api/game/${gameId}`, { headers })
    )
  }
}
