import { Component, Input, OnInit } from '@angular/core';
import {PileInfo} from '../models';

@Component({
  selector: 'app-deck-pile',
  templateUrl: './deck-pile.component.html',
  styleUrl: './deck-pile.component.css'
})
export class DeckPileComponent implements OnInit {

  @Input({ required: true })
  pile!: PileInfo

  ngOnInit() {
  }

}
