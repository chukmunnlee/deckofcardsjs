import { Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import {GameStore} from '../services/game.store';
import {ActivatedRoute, Router} from '@angular/router';
import {GameService} from '../services/game.service';
import {Observable, firstValueFrom, tap} from 'rxjs';
import {GetGameQRCodeResponse} from 'common/models/response';
import {ADMIN_START, GameRepository} from '../services/game.repository';

@Component({
  selector: 'app-wait-start',
  templateUrl: './wait-game.component.html',
  styleUrl: './wait-game.component.css'
})
export class WaitGameComponent implements OnInit {

  @Input({ required: true })
  gameId: string = ''

  readonly router = inject(Router)
  readonly gameStore = inject(GameStore)
  readonly gameRepo = inject(GameRepository)
  readonly gameSvc = inject(GameService)
  readonly activatedRoute = inject(ActivatedRoute)

  qr!: GetGameQRCodeResponse
  canShare = false
  name = ''
  errorText = ''
  image$!: Promise<GetGameQRCodeResponse>
  players$!: Observable<string[]>

  private _cannotStart = true

  ngOnInit(): void {
    firstValueFrom(this.gameStore.dump$)
    this.image$ = this.gameSvc.getGameQRById(this.gameId)
        .then(qr => {
          this.qr = qr
          return qr
        })
    this.players$ = this.gameStore.players$
    this.canShare = this.gameSvc.canShare()
    this.name = this.activatedRoute.snapshot.queryParams['name'] || 'NO SET'
    this.refresh()
  }

  share(shareText: string) {
    this.gameSvc.share({
      title: 'Deck of Cards',
      text: `GameId: ${this.gameId}`,
      url: shareText
    })
  }
  copyToClipBoard(shareText: string) {
    navigator.clipboard.writeText(shareText)
  }

  removePlayer(name: string) {
    firstValueFrom(this.gameStore.password$)
      .then(password => this.gameSvc.removePlayerFromGame(this.gameId, name, password))
      .then(() => {
        this.gameStore.removePlayer(name)
        return firstValueFrom(this.gameStore.players$)
      })
      .then(players => this._cannotStart = players.length <= 0)
  }

  refresh() {
    firstValueFrom(this.gameSvc.getPlayersInGame(this.gameId))
        .then(players => {
          this._cannotStart = !players
          this.gameStore.updatePlayers(!players? []: players.map(p => p.name))
        })
  }
  canStart() {
    return this._cannotStart
  }
  start() {
    firstValueFrom(this.gameStore.password$)
      .then(password => this.gameSvc.startGame(this.gameId, password))
      .then(() => this.gameRepo.updateGame(this.gameId, { stage: ADMIN_START }))
      .then(() => this.router.navigate(['/play-game', this.gameId]))
      .catch(error => {
        this.errorText = error.error.message
      })
  }
  back() {
    firstValueFrom(this.gameStore.password$)
      .then(password => this.gameSvc.deleteGameById(this.gameId, password))
      .then(result => this.gameRepo.deleteGameById(result.gameId))
      .then(() => this.router.navigate(['/']))
  }

}
