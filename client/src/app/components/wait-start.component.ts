import { Component, Input, OnInit, inject } from '@angular/core';
import {GameStore} from '../services/game.store';
import {ActivatedRoute, Router} from '@angular/router';
import {GameService} from '../services/game.service';
import {firstValueFrom} from 'rxjs';
import {GetGameQRCodeResponse} from 'common/models/response';

@Component({
  selector: 'app-wait-start',
  templateUrl: './wait-start.component.html',
  styleUrl: './wait-start.component.css'
})
export class WaitStartComponent implements OnInit {

  @Input({ required: true })
  gameId: string = ''

  readonly router = inject(Router)
  readonly gameStore = inject(GameStore)
  readonly gameSvc = inject(GameService)
  readonly activatedRoute = inject(ActivatedRoute)

  image$!: Promise<GetGameQRCodeResponse>
  qr!: GetGameQRCodeResponse
  canShare = false

  ngOnInit(): void {
    firstValueFrom(this.gameStore.dump$)
      .then(state => console.info('>>> game state: ', state))
    this.image$ = this.gameSvc.getGameQRById(this.gameId)
        .then(qr => {
          this.qr = qr
          return qr
        })
    this.canShare = this.gameSvc.canShare()
  }

  share() {
    this.gameSvc.share({
      title: 'Deck of Cards',
      text: `GameId: ${this.gameId}`,
      url: this.qr.url
    })
  }

  back() {
    firstValueFrom(this.gameStore.password$)
      .then(password => this.gameSvc.deleteGameById(this.gameId, password))
      .then(() => this.router.navigate(['/']))
  }

}
