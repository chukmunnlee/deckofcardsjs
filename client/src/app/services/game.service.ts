import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable, inject} from "@angular/core";
import {GameStatus} from "common/models/game";
import {DeleteGameResponse, GetGameQRCodeResponse, GetPlayersInGame, JoinGameResponse} from "common/models/response";
import {firstValueFrom, map} from "rxjs";

@Injectable()
export class GameService {
  readonly http = inject(HttpClient)

  share(payload: any) {
    return navigator.share(payload)
  }

  canShare() {
    return !!navigator.share && navigator.canShare({url: 'test'})
  }

  joinGameById(gameId: string, name: string) {
    return firstValueFrom(
      this.http.post<JoinGameResponse>(`/api/game/${gameId}/player`, { name })
    )
  }

  getGameStatusById(gameId: string) {
    return firstValueFrom(
      this.http.get<GameStatus>(`/api/game/${gameId}`)
    )
  }

  getPlayersInGame(gameId: string) {
    return this.http.get<GetPlayersInGame>(`/api/game/${gameId}/players`)
        .pipe(map(resp => !resp.players.length? undefined: resp.players))
  }

  getGameQRById(gameId: string) {
    return firstValueFrom(
      this.http.get<GetGameQRCodeResponse>(`/api/game/${gameId}/qr`)
    )
  }

  deleteGameById(gameId: string, password: string) {
    const headers = new HttpHeaders()
        .set('X-Game-Password', password)
    return firstValueFrom(
      this.http.delete<DeleteGameResponse>(`/api/game/${gameId}`, { headers })
    )
  }

  removePlayerFromGame(gameId: string, name: string, password: string) {
    const headers = new HttpHeaders()
        .set('X-Game-Password', password)
    const params = { name, admin: true }
    return firstValueFrom(
      this.http.delete<DeleteGameResponse>(`/api/game/${gameId}/player`, { headers, params })
    )
  }

  leaveGameByGameId(gameId: string, name: string, password: string) {
    const headers = new HttpHeaders()
        .set('X-Game-Password', password)
    const params = { name }
    return firstValueFrom(
      this.http.delete<DeleteGameResponse>(`/api/game/${gameId}/player`, { headers, params })
    )
  }
}
