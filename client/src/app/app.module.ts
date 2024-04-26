import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {RouterModule, Routes} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { MainComponent } from './components/main.component';
import { ListDecksComponent } from './components/list-decks.component';
import {DeckService} from './services/deck.service';

const appRoutes: Routes = [
  { path: '', component: MainComponent },
  { path: 'list-decks', component: ListDecksComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
]

@NgModule({
  declarations: [
    AppComponent,
    MainComponent, ListDecksComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, ReactiveFormsModule,
    RouterModule.forRoot(appRoutes, { useHash: true })
  ],
  providers: [ DeckService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
