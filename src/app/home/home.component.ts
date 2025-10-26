import { Component, OnInit } from '@angular/core';
import { GameService, GameInfo, GameData } from '../service/game.service';
import { Observable, combineLatest, zip } from 'rxjs';
import { map, flatMap, mergeAll, share } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  games$: Observable<GameInfo[]>;

  selectedGame?: GameData;

  gameData: GameData;

  constructor(
    private readonly game: GameService,
  ) { }

  loadGames(date: Date) {
    this.games$ = this.game.getDateGames(date).pipe(
      map(res => res.games),
    );
  }

  isSelected(game: GameInfo) {
    return this.selectedGame && this.selectedGame.header.id === game.external_id;
  }

  selectGame(game: GameData) {
    this.selectedGame = game;
    this.gameData = game;
  }

  updateBoxscore(game: GameData) {
    if (this.selectedGame && this.selectedGame.header.id === game.header.id) {
      this.gameData = game;
    }
  }

  ngOnInit() {
  }

}
