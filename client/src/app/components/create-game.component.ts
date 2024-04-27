import { Component, OnInit, inject } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import { PostDeckById } from 'common/models/request'
import {DeckService} from '../services/deck.service';
import {DeckSummary} from 'common/models/deck';
import {Router} from '@angular/router';
import {GameStore} from '../services/game.store';
import {GameService} from '../services/game.service';

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

  ngOnInit(): void {
    this.deckSummary$ = this.deckSvc.getDecks()
    this.form = this.createForm()
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
