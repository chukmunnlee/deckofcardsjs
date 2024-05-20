import { Component, Input, OnInit, inject } from '@angular/core';
import {GameService} from '../services/game.service';
import {Title} from '@angular/platform-browser';
import {firstValueFrom} from 'rxjs';
import {GameStore} from '../services/game.store';
import {Router} from '@angular/router';
import {GameRepository} from '../services/game.repository';
import {DeckService} from '../services/deck.service';

export interface PileInfo {
  [key: string]: number
}

@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrl: './play-game.component.css'
})
export class PlayGameComponent implements OnInit {

  readonly gameSvc = inject(GameService)
  readonly deckSvc = inject(DeckService)
  readonly gameStore = inject(GameStore)
  readonly gameRepo = inject(GameRepository)
  readonly router = inject(Router)
  readonly title = inject(Title)

  @Input()
  gameId: string = ''

  discarded = 0
  piles: PileInfo = {}

  backImage!: string

  ngOnInit(): void {
    this.title.setTitle(`GameId: ${this.gameId}`)
    screen.orientation.unlock()
    // @ts-ignore
    screen.orientation.lock('landscape-primary')
        .catch((_: any) => {})

    Promise.all([
      this.gameSvc.getGameStatusById(this.gameId),
      firstValueFrom(this.gameSvc.getPlayersInGame(this.gameId)),
    ]).then(([status, players]) => {
        this.gameStore.updateStatus(status)
        for (let p in status.piles) {
          let c = p.match(/^pile([0-9]+)$/)
          if (!c)
            continue
          this.piles[p] = status.piles[p]
        }
        return this.deckSvc.getDeckBackImage(status.deckId)
      })
      .then(backImage => this.backImage = backImage)
  }

  back() {
    firstValueFrom(this.gameStore.password$)
      .then(password => this.gameSvc.deleteGameById(this.gameId, password))
      .then(() => this.gameRepo.deleteGameById(this.gameId))
      .then(() => this.router.navigate(['/']))
  }

}
