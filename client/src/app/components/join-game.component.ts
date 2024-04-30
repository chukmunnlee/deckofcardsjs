import { Component, Input, OnInit, inject } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrl: './join-game.component.css'
})
export class JoinGameComponent implements OnInit {

  readonly activatedRoute = inject(ActivatedRoute)
  readonly fb = inject(FormBuilder)

  @Input()
  gameId = ''

  name = ''

  form!: FormGroup

  ngOnInit(): void {
    this.gameId = this.activatedRoute.snapshot.params['gameId'] || ''
    this.name = this.activatedRoute.snapshot.queryParams['name'] || ''
    this.form = this.createForm(this.gameId)
  }

  process() {
    const details = { gameId: this.gameId, ...this.form.value }
    console.info('>>> details: ', details)
  }

  private createForm(gameId: string = ''): FormGroup {
    return this.fb.group({
      gameId: this.fb.control<string>(gameId, [ Validators.required ]),
      name: this.fb.control<string>('', [ Validators.required, Validators.minLength(3) ])
    })
  }

}
