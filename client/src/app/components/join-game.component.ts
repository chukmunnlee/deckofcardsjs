import { Component, Input, OnInit, inject } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {GameService} from '../services/game.service';
import {GameStore} from '../services/game.store';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrl: './join-game.component.css'
})
export class JoinGameComponent implements OnInit {

  readonly router = inject(Router)
  readonly activatedRoute = inject(ActivatedRoute)
  readonly fb = inject(FormBuilder)
  readonly gameSvc = inject(GameService)
  readonly gameStore = inject(GameStore)

  @Input()
  gameId = ''

  name = ''
  errorText = ''

  form!: FormGroup

  ngOnInit(): void {
    this.gameId = this.activatedRoute.snapshot.params['gameId'] || ''
    this.name = this.activatedRoute.snapshot.queryParams['name'] || ''
    this.form = this.createForm(this.gameId)
  }

  process() {
    const details = { gameId: this.gameId, ...this.form.value }
    this.gameSvc.joinGameById(details.gameId, details.name)
      .then(result => {
        this.gameStore.initPlayer({ name: details.name, password: result.password })
        this.gameStore.setGameId(details.gameId)
        const queryParams: any = {}
        queryParams['name'] = !!this.name? this.name: details.name

        this.router.navigate(['/wait-start', details.gameId ], { queryParams })
      })
      .catch(error => {
        this.errorText = error.error.message
      })
  }

  private createForm(gameId: string = ''): FormGroup {
    return this.fb.group({
      gameId: this.fb.control<string>(gameId, [ Validators.required ]),
      name: this.fb.control<string>('', [ Validators.required, Validators.minLength(3) ])
    })
  }

}
