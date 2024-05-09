import { Component, OnInit, inject } from '@angular/core';
import {GameStore} from '../services/game.store';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {

  private readonly gameStore = inject(GameStore)
  private readonly title = inject(Title)

  ngOnInit(): void {
    this.gameStore.reset()
    this.title.setTitle('Deck of Cards')
    screen.orientation.unlock()
    // @ts-ignore
    screen.orientation.lock('portrait-primary')
        .catch((_: any) => {})
  }
}
