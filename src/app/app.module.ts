import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './common/menu/menu.component';
import { DatePickerComponent } from './home/date-picker/date-picker.component';
import { GameCardComponent } from './home/game-card/game-card.component';
import { GameCardViewComponent } from './home/game-card/game-card-view/game-card-view.component';
import { BoxscoreComponent } from './home/boxscore/boxscore.component';
import { TeamScoreComponent } from './home/boxscore/team-score/team-score.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuComponent,
    DatePickerComponent,
    GameCardComponent,
    GameCardViewComponent,
    BoxscoreComponent,
    TeamScoreComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
