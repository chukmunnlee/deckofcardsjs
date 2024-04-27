import { Component, Input, OnInit, inject } from '@angular/core';
import {GameStore} from '../services/game.store';
import {Router} from '@angular/router';
import {GameService} from '../services/game.service';
import {firstValueFrom} from 'rxjs';

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

  ngOnInit(): void {
    firstValueFrom(this.gameStore.dump$)
      .then(state => console.info('>>> game state: ', state))
  }

  back() {
    firstValueFrom(this.gameStore.password$)
      .then(password => this.gameSvc.deleteGameById(this.gameId, password))
      .then(() => this.router.navigate(['/']))
  }

}
