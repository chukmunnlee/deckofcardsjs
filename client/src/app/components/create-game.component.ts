import { Component, OnInit, inject } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import { PostDeckById } from 'common/models/request'
import {DeckService} from '../services/deck.service';
import {DeckPresets, DeckSummary} from 'common/models/deck';
import {Router} from '@angular/router';
import {GameStore} from '../services/game.store';
import {GameService} from '../services/game.service';

const PRESET_DEFAULTS: DeckPresets = {
  count: 1, split: 1, shuffle: true, replacement: false
}

@Component({
  selector: 'app-list-decks',
  templateUrl: './create-game.component.html',
  styleUrl: './create-game.component.css'
})
export class CreateGameComponent implements OnInit {

  private readonly deckSvc = inject(DeckService)
  private readonly gameSvc = inject(GameService)
  private readonly fb = inject(FormBuilder)
  private readonly gameStore = inject(GameStore)
  private readonly router = inject(Router)

  deckSummary$!: Promise<DeckSummary[]>
  form!: FormGroup
  decks: DeckSummary[] = []
  description: string = ""

  ngOnInit(): void {
    this.deckSummary$ = this.deckSvc.getDecks()
        .then(decks => {
          this.decks = decks
          return decks
        })
    this.form = this.createForm()
  }

  onDeckChange(selectCtrl: any) {
    const deckId = selectCtrl.target.value
    const idx = this.decks.findIndex(deck => deck.deckId === deckId)
    const presets: DeckPresets = this.decks[idx].presets
    this.form.setValue({
      deckId, ...presets
    })
    // @ts-ignore
    this.description = this.decks[idx]?.description
  }

  createGame() {
    const createGameReq: PostDeckById = this.form.value
    this.deckSvc.createGame(createGameReq)
      .then(result =>
        Promise.all([ result.password, this.gameSvc.getGameStatusById(result.gameId) ])
      )
      .then(results => {
        this.gameStore.initAdmin({ password: results[0], status: results[1] })
        this.router.navigate(['/wait-game', results[1].gameId])
      })
  }

  private createForm(): FormGroup {
    return this.fb.group({
      deckId: this.fb.control<string>('', [ Validators.required ]),
      count: this.fb.control<number>(1, [ Validators.required, Validators.min(1) ]),
      split: this.fb.control<number>(1, [ Validators.required, Validators.min(1) ]),
      shuffle: this.fb.control<boolean>(true),
      replacement: this.fb.control<boolean>(false),
    })
  }

}
