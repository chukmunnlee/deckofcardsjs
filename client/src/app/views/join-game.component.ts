import { Component, Input, OnInit, inject } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {GameService} from '../services/game.service';
import {GameStore} from '../services/game.store';
import {GameRepository, RunningGame, WAIT_START} from '../services/game.repository';

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
  readonly gameRepo = inject(GameRepository)

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
    Promise.all([
      this.gameSvc.joinGameById(details.gameId, details.name),
      this.gameSvc.getDeckFromGameId(details.gameId)
    ])
      .then(([ result, deck ] )=> {
        this.gameStore.initPlayer({ name: details.name, password: result.password })
        this.gameStore.setGameId(details.gameId)
        const runningGame: RunningGame = {
            deckId: deck.deckId,
            deckName: deck.name,
            gameId: details.gameId,
            password: result.password,
            sessionKey: '',
            name: details.name,
            admin: false,
            stage: WAIT_START,
            createdOn: (new Date()).getTime()
        }
        return this.gameRepo.addGameAsPlayer(runningGame)
      })
      .then(() => this.router.navigate(['/wait-start', details.gameId ]))
      .catch(error => {
        if ('error' in error)
          this.errorText = error.error.message
        else
          this.errorText = error
      })
  }

  private createForm(gameId: string = ''): FormGroup {
    return this.fb.group({
      gameId: this.fb.control<string>(gameId, [ Validators.required ]),
      name: this.fb.control<string>('', [ Validators.required, Validators.minLength(3) ])
    })
  }

}
