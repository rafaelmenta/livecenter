import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { GameData } from 'src/app/service/game.service';
import { Profile } from 'selenium-webdriver/firefox';

interface BoxTeam {
  team: any;
  players: any;
  info: any;
  score: any;
}

@Component({
  selector: 'app-boxscore',
  templateUrl: './boxscore.component.html',
  styleUrls: ['./boxscore.component.css']
})
export class BoxscoreComponent implements OnChanges {

  @Input() game: GameData;

  home: BoxTeam;
  away: BoxTeam;

  constructor() { }

  ngOnChanges() {
    const homeIndex = this.game.header.competitions[0].competitors[0].homeAway === 'home' ? 0 : 1;
    const awayIndex = homeIndex === 0 ? 1 : 0;
    this.home = {
      team: this.game.boxscore.teams[1] as any,
      players: this.game.boxscore.players[1] as any,
      info: this.game.header.competitions[0].competitors[homeIndex],
      score: Number(this.game.header.competitions[0].competitors[homeIndex].score),
    };

    this.away = {
      team: this.game.boxscore.teams[0] as any,
      players: this.game.boxscore.players[0] as any,
      info: this.game.header.competitions[0].competitors[awayIndex],
      score: Number(this.game.header.competitions[0].competitors[awayIndex].score),
    };
  }

  winnerId() {
    return this.home.score > this.away.score ? this.home.info.id : this.away.info.id;
  }

}
