import { Component, OnInit, Input } from '@angular/core';
import { GameData } from 'src/app/service/game.service';
import { Profile } from 'selenium-webdriver/firefox';

@Component({
  selector: 'app-boxscore',
  templateUrl: './boxscore.component.html',
  styleUrls: ['./boxscore.component.css']
})
export class BoxscoreComponent implements OnInit {

  @Input() game: GameData;

  constructor() { }

  ngOnInit() {
  }

  winnerId() {
    const home = this.game.homeTeam;
    const away = this.game.awayTeam;

    return home.score.score > away.score.score ? home.profile.id : away.profile.id;
  }

}
