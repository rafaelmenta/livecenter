import { Component, OnInit, Input } from '@angular/core';
import { TeamData } from 'src/app/service/game.service';

@Component({
  selector: 'app-team-score',
  templateUrl: './team-score.component.html',
  styleUrls: ['./team-score.component.css']
})
export class TeamScoreComponent implements OnInit {

  @Input() team: TeamData;

  @Input() winner: string;

  constructor() { }

  ngOnInit() {
  }

  winnerScore() {
    return this.team.profile.id === this.winner ? 1 : -1;
  }

  stringToBool(bool: string) {
    return bool === 'true';
  }
}
