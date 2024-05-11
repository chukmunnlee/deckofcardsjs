import { Component, OnInit, inject } from '@angular/core';
import {Router} from '@angular/router';
import {ADMIN_START, GameRepository, PLAYER_START, RunningGame, WAIT_GAME, WAIT_START} from '../services/game.repository';

import {GameService} from '../services/game.service';
import {GameStore} from '../services/game.store';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-resume-games',
  templateUrl: './resume-games.component.html',
  styleUrl: './resume-games.component.css'
})
export class ResumeGamesComponent implements OnInit {

  private readonly gamesRepo = inject(GameRepository)
  private readonly gameStore = inject(GameStore)
  private readonly gameSvc = inject(GameService)
  private readonly router = inject(Router)

  errorText = ''

  runningGames$!: Promise<RunningGame[]>

  ngOnInit(): void {
    this.runningGames$ = this.gamesRepo.getGames()
  }

  resume(gameId: string, admin: boolean) {
    console.info(`resume gameId: ${gameId}`)
    this.gamesRepo.getGameById(gameId)
      .then(result => {
        if (!result)
          throw `Strange. Cannot find game ${gameId}`
        switch (result.stage) {
          // admin
          case WAIT_GAME:
            this.gameStore.initAdmin({ password: result.password })
            return this.gameSvc.getGameStatusById(gameId)
              .then(gameStatus => {
                this.gameStore.updateStatus(gameStatus)
                return result
              })

          case ADMIN_START:
            return result

          case WAIT_START:
            this.gameStore.initPlayer({ name: result.name, password: result.password })
            this.gameStore.setGameId(result.gameId)
            return result

          case PLAYER_START:
            return result

          default:
            throw `Unknown stage: ${result.stage}. Cannot resume`
        }
      })
      .then((result) => {
        console.info('>>> result: ', result)
        if (result?.admin)
          this.router.navigate(['/wait-game', result.gameId]
              , { queryParams: { name: result.deckName } })
        else
          this.router.navigate(['/wait-start', result?.gameId ])
      })
      .catch(error => {
        if ('error' in error)
          this.errorText = error.error.message
        else
          this.errorText = error
      })
  }

  deleteGame(gameId: string, admin: boolean) {
    console.info(`gameId: ${gameId}`)
    if (admin)
      firstValueFrom(this.gameStore.password$)
        .then(password => this.gameSvc.deleteGameById(gameId, password))
        .then(result => this.gamesRepo.deleteGameById(result.gameId))
        .then(() => this.router.navigate(['/']))
    else
      Promise.all([ firstValueFrom(this.gameStore.name$)
          , firstValueFrom(this.gameStore.password$) ]
      ).then(([ name, password ]) =>
          this.gameSvc.leaveGameByGameId(gameId, name, password))
      .then(result => this.gamesRepo.deleteGameById(result.gameId))
      .then(() => this.router.navigate(['/']))
  }
}
