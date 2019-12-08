import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GameData, GAME_STATE } from 'src/app/service/game.service';

@Component({
  selector: 'app-game-card-view',
  templateUrl: './game-card-view.component.html',
  styleUrls: ['./game-card-view.component.css']
})
export class GameCardViewComponent implements OnInit {

  @Input() game: GameData;
  @Input() selected: boolean = false;

  @Output() gameSelected = new EventEmitter<GameData>();


  constructor() { }

  ngOnInit() {
  }

  get isLive() {
    return this.game.boxscore.status === GAME_STATE.ONGOING;
  }

  get isFuture() {
    return this.game.boxscore.status === GAME_STATE.SCHEDULED;
  }

  selectGame() {
    if (!this.isFuture) {
      this.gameSelected.emit(this.game);
    }
  }

  isWinner(teamId) {
    const away = {
      id: this.game.gameProfile.awayTeamId,
      score: this.game.boxscore.awayScore,
    };

    const home = {
      id: this.game.gameProfile.homeTeamId,
      score: this.game.boxscore.homeScore,
    };

    return this.game.boxscore.status === GAME_STATE.FINAL && (
      (teamId === away.id && away.score > home.score) ||
      (teamId === home.id && home.score > away.score)
    );
  }
}
