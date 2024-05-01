import { Component, Input, OnInit, inject } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GameService} from '../services/game.service';
import {GameStore} from '../services/game.store';
import {firstValueFrom, tap, withLatestFrom} from 'rxjs';

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

  @Input({ required: true })
  gameId = ''

  name = ''
  errorText = ''

  ngOnInit(): void {
    this.name = this.activatedRoute.snapshot.queryParams['name']
  }

  back() {
    firstValueFrom(
      this.gameStore.name$.pipe(
        withLatestFrom(this.gameStore.password$),
      )
    ).then(([ name, password ]) =>
        this.gameSvc.leaveGameByGameId(this.gameId, name, password)
    ).then(() => this.router.navigate(['/']))
  }

  start() {
  }

}
