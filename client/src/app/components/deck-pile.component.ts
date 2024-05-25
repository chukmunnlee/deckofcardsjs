import { Component, Input, OnInit, inject } from '@angular/core';
import {PileInfo} from '../models';
import {GameStore} from '../services/game.store';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-deck-pile',
  templateUrl: './deck-pile.component.html',
  styleUrl: './deck-pile.component.css',
})
export class DeckPileComponent implements OnInit {

  private readonly gameStore = inject(GameStore)

  @Input({ required: true })
  pile!: PileInfo

  pileCount$!: Observable<number>

  ngOnInit() {
    this.pileCount$ = this.gameStore.pileCount$(this.pile.name)
  }

}
