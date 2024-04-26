import { Component, OnInit, inject } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {DeckService} from '../services/deck.service';
import {DeckSummary} from 'common/models/deck';

@Component({
  selector: 'app-list-decks',
  templateUrl: './list-decks.component.html',
  styleUrl: './list-decks.component.css'
})
export class ListDecksComponent implements OnInit {

  private readonly deckSvc = inject(DeckService)
  private readonly fb = inject(FormBuilder)

  deckSummary$!: Promise<DeckSummary[]>
  form!: FormGroup

  ngOnInit(): void {
    this.deckSummary$ = this.deckSvc.getDecks()
    this.form = this.createForm()
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
