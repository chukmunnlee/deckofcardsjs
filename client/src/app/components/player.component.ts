import { Component, Input, OnInit, inject } from '@angular/core';
import {GameService} from '../services/game.service';
import {Title} from '@angular/platform-browser';
import {firstValueFrom} from 'rxjs';
import {GameStore} from '../services/game.store';
import {Router} from '@angular/router';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrl: './player.component.css'
})
export class PlayerComponent implements OnInit {

  readonly gameSvc = inject(GameService)
  readonly gameStore = inject(GameStore)
  readonly router = inject(Router)
  readonly title = inject(Title)

  @Input()
  gameId: string = ''

  errorText = ''

  ngOnInit(): void {
    firstValueFrom(this.gameStore.name$)
      .then(name => this.title.setTitle(`Name: ${name} - ${this.gameId}`))
    screen.orientation.unlock()
    // @ts-ignore
    screen.orientation.lock('landscape-primary')
        .catch((_: any) => {})
  }

  back() {
    Promise.all([ firstValueFrom(this.gameStore.name$)
        , firstValueFrom(this.gameStore.password$) ]
    ).then(([ name, password ]) =>
        this.gameSvc.leaveGameByGameId(this.gameId, name, password)
    ).then(() => this.router.navigate(['/']))
  }

}
