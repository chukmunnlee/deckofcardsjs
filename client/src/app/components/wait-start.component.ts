import { Component, Input, OnInit, inject } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GameService} from '../services/game.service';
import {GameStore} from '../services/game.store';
import {Observable, firstValueFrom, tap} from 'rxjs';
import {GameRepository, PLAYER_START} from '../services/game.repository';

@Component({
  selector: 'app-wait-start',
  templateUrl: './wait-start.component.html',
  styleUrl: './wait-start.component.css'
})
export class WaitStartComponent implements OnInit {

  readonly router = inject(Router)
  readonly activatedRoute = inject(ActivatedRoute)
  readonly gameSvc = inject(GameService)
  readonly gameStore = inject(GameStore)
  readonly gameRepo = inject(GameRepository)

  @Input({ required: true })
  gameId = ''

  name$!: Observable<string>
  errorText = ''

  ngOnInit(): void {
    this.name$ = this.gameStore.name$
  }

  back() {
    Promise.all([ firstValueFrom(this.gameStore.name$)
        , firstValueFrom(this.gameStore.password$) ]
    ).then(([ name, password ]) =>
        this.gameSvc.leaveGameByGameId(this.gameId, name, password))
    .then(result => this.gameRepo.deleteGameById(result.gameId))
    .then(() => this.router.navigate(['/']))
  }

  start() {
    Promise.all([ firstValueFrom(this.gameStore.name$)
        , firstValueFrom(this.gameStore.password$) ]
    ).then(([ name, password ]) => this.gameSvc.startGameAsPlayer(this.gameId, name, password)
    ).then(result => {
      this.gameStore.updateSessionKey(result.sessionKey).unsubscribe()
      return this.gameRepo.updateGame(this.gameId, { stage: PLAYER_START, sessionKey: result.sessionKey })
    }).then(() => this.router.navigate(['/player', this.gameId]))
    .catch(error => this.errorText = error.error.message)
  }

}
