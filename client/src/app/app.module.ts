import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {RouterModule, Routes} from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';

import {DeckService} from './services/deck.service';
import {GameService} from './services/game.service';
import {GameStore} from './services/game.store';

import { AppComponent } from './app.component';
import { MainComponent } from './views/main.component';
import { CreateGameComponent } from './views/create-game.component';
import { WaitGameComponent } from './views/wait-game.component'
import {JoinGameComponent} from './views/join-game.component';
import { WaitStartComponent } from './views/wait-start.component';
import { ErrorMessageComponent } from './components/error-message.component';
import { PlayGameComponent } from './views/play-game.component';
import { PlayerComponent } from './views/player.component';
import {GameRepository} from './services/game.repository';
import { ResumeGamesComponent } from './views/resume-games.component';
import {hasRunningGames} from './route-guards';
import { DeckPileComponent } from './components/deck-pile.component';
import {MaterialModule} from './material.module';

const appRoutes: Routes = [
  { path: '', component: MainComponent },
  { path: 'create-game', component: CreateGameComponent },
  { path: 'resume-games', component: ResumeGamesComponent,
    canActivate: [ hasRunningGames ]
  },
  { path: 'wait-game/:gameId', component: WaitGameComponent },
  { path: 'join-game/:gameId', component: JoinGameComponent },
  { path: 'join-game', component: JoinGameComponent },
  { path: 'wait-start/:gameId', component: WaitStartComponent },
  { path: 'play-game/:gameId', component: PlayGameComponent },
  { path: 'player/:gameId', component: PlayerComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
]

@NgModule({
  declarations: [ AppComponent, ErrorMessageComponent,
    MainComponent, CreateGameComponent, WaitGameComponent,
    JoinGameComponent, WaitStartComponent,
    PlayGameComponent, PlayerComponent, ResumeGamesComponent, DeckPileComponent, ],

  bootstrap: [AppComponent],

  imports: [BrowserModule, ReactiveFormsModule, MaterialModule,
    RouterModule.forRoot(appRoutes, { useHash: true, bindToComponentInputs: true })],

  providers: [DeckService, GameService, GameStore, GameRepository,
    provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
