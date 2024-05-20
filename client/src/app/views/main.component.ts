import { Component, OnInit, inject } from '@angular/core';
import {GameStore} from '../services/game.store';
import {Title} from '@angular/platform-browser';
import {GameRepository} from '../services/game.repository';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {

  private readonly gameStore = inject(GameStore)
  private readonly gameRepo = inject(GameRepository)
  private readonly title = inject(Title)

  hasRunningGames = false

  ngOnInit(): void {
    this.title.setTitle('Deck of Cards')

    screen.orientation.unlock()
    // @ts-ignore
    screen.orientation.lock('portrait-primary')
        .catch((_: any) => {})

    this.gameStore.reset()
    this.gameRepo.getGames()
      .then(games => this.hasRunningGames = games.length > 0)
  }
}
