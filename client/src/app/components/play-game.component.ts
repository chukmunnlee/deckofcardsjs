import { Component, Input, OnInit, inject } from '@angular/core';
import {GameService} from '../services/game.service';
import {Title} from '@angular/platform-browser';
import {firstValueFrom} from 'rxjs';
import {GameStore} from '../services/game.store';
import {Router} from '@angular/router';
import {GameRepository} from '../services/game.repository';
import {GameStatus} from 'common/models/game';

@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrl: './play-game.component.css'
})
export class PlayGameComponent implements OnInit {

  readonly gameSvc = inject(GameService)
  readonly gameStore = inject(GameStore)
  readonly gameRepo = inject(GameRepository)
  readonly router = inject(Router)
  readonly title = inject(Title)

  @Input()
  gameId: string = ''

  status$!: Promise<GameStatus>

  ngOnInit(): void {
    this.title.setTitle(`GameId: ${this.gameId}`)
    screen.orientation.unlock()
    // @ts-ignore
    screen.orientation.lock('landscape-primary')
        .catch((_: any) => {})

    this.status$ = this.gameSvc.getGameStatusById(this.gameId)
      .then(status => {
        this.gameStore.updateStatus(status)
        console.info('>>> status: ', status)
        return status
      })
  }

  back() {
    firstValueFrom(this.gameStore.password$)
      .then(password => this.gameSvc.deleteGameById(this.gameId, password))
      .then(() => this.gameRepo.deleteGameById(this.gameId))
      .then(() => this.router.navigate(['/']))
  }

}
