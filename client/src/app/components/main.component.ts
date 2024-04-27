import { Component, OnInit, inject } from '@angular/core';
import {GameStore} from '../services/game.store';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {

  private readonly gameStore = inject(GameStore)

  ngOnInit(): void {
    this.gameStore.reset()
  }

}
