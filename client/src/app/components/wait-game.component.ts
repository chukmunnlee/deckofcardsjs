import { Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import {GameStore} from '../services/game.store';
import {ActivatedRoute, Router} from '@angular/router';
import {GameService} from '../services/game.service';
import {Observable, firstValueFrom} from 'rxjs';
import {GetGameQRCodeResponse} from 'common/models/response';
import {Player} from 'common/models/game';

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
  readonly gameSvc = inject(GameService)
  readonly activatedRoute = inject(ActivatedRoute)

  qr!: GetGameQRCodeResponse
  canShare = false
  name = ''
  errorText = ''
  image$!: Promise<GetGameQRCodeResponse>
  players$!: Observable<Player[] | undefined>

  ngOnInit(): void {
    firstValueFrom(this.gameStore.dump$)
    this.image$ = this.gameSvc.getGameQRById(this.gameId)
        .then(qr => {
          this.qr = qr
          return qr
        })
    this.canShare = this.gameSvc.canShare()
    this.name = this.activatedRoute.snapshot.queryParams['name'] || 'NO SET'
  }

  share() {
    this.gameSvc.share({
      title: 'Deck of Cards',
      text: `GameId: ${this.gameId}`,
      url: this.qr.url
    })
  }
  copyToClipBoard() {
    navigator.clipboard.writeText(this.gameId)
  }

  removePlayer(name: string) {
    firstValueFrom(this.gameStore.password$)
      .then(password => this.gameSvc.removePlayerFromGame(this.gameId, name, password))
      .then(() => this.refresh())
  }

  refresh() {
    this.players$ = this.gameSvc.getPlayersInGame(this.gameId)
  }

  back() {
    firstValueFrom(this.gameStore.password$)
      .then(password => this.gameSvc.deleteGameById(this.gameId, password))
      .then(() => this.router.navigate(['/']))
  }

}
