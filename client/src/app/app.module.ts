import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {RouterModule, Routes} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';

import {DeckService} from './services/deck.service';
import {GameService} from './services/game.service';
import {GameStore} from './services/game.store';

import { AppComponent } from './app.component';
import { MainComponent } from './components/main.component';
import { CreateGameComponent } from './components/create-game.component';
import { WaitGameComponent } from './components/wait-game.component'
import {JoinGameComponent} from './components/join-game.component';
import { WaitStartComponent } from './components/wait-start.component';
import { ErrorMessageComponent } from './components/error-message.component';

const appRoutes: Routes = [
  { path: '', component: MainComponent },
  { path: 'create-game', component: CreateGameComponent },
  { path: 'wait-game/:gameId', component: WaitGameComponent },
  { path: 'join-game/:gameId', component: JoinGameComponent },
  { path: 'join-game', component: JoinGameComponent },
  { path: 'wait-start/:gameId', component: WaitStartComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
]

@NgModule({
  declarations: [
    AppComponent, MainComponent, CreateGameComponent, WaitGameComponent,
    JoinGameComponent,
    WaitStartComponent,
    ErrorMessageComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, ReactiveFormsModule,
    RouterModule.forRoot(appRoutes, { useHash: true, bindToComponentInputs: true })
  ],
  providers: [ DeckService, GameService, GameStore ],
  bootstrap: [AppComponent]
})
export class AppModule { }
