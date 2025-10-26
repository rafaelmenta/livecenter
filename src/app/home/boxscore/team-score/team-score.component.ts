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
    return this.team.info.id === this.winner ? 1 : -1;
  }

  stringToBool(bool: string) {
    return bool === 'true';
  }

  players() {
    // E.g. ["MIN","FG","3PT","FT","OREB","DREB","REB","AST","STL","BLK","TO","PF","+/-","PTS"]
    const labels = this.team.players.statistics[0].labels;

    const data = this.team.players.statistics[0].athletes.map(athlete => this.mapPlayerplayer(athlete, labels));
    return data;
  }

  teamScore() {
    return this.mapTeamStats(this.team.team, this.team.score);
  }

  mapTeamStats(team, score) {

    const totals = team.statistics.reduce((soFar, stat) => {
      soFar[stat.abbreviation || stat.label] = stat.displayValue;
      return soFar;
    }, {});

    const stats = {
      field_goal:         totals['FG'],
      free_throw:         totals['FT'],
      three_points:       totals['3PT'],
      offensive_rebounds: totals['OR'],
      defensive_rebounds: totals['DR'],
      rebounds:           totals['REB'],
      assists:            totals['AST'],
      personal_fouls:     totals['PF'],
      steals:             totals['STL'],
      turnovers:          totals['TO'],
      blocks:             totals['BLK'],
      points:             score,
    }

    return stats;
  }


  mapPlayerplayer(player, labels) {
    const name = player.athlete.displayName;
    const starter = player.starter;
    const active = player.active;
    const position = player.athlete.position.abbreviation;

  // E.g. ["26","5-12","2-7","1-2","1","5","6","6","0","1","2","3","-8","13"]
    const totals = player.stats;
    const dnp = player.didNotPlay;
    const dnpReason = player.reason;

    if (dnp) {
      const stats = {
        minutes: 0,
        field_goal_attempts: 0,
        free_throw_attempts: 0,
        offensive_rebounds: 0,
        defensive_rebounds: 0,
        assists: 0,
        personal_fouls: 0,
        steals: 0,
        turnovers: 0,
        blocks: 0,
        points: 0,
      }
      return {name, stats, dnp, dnpReason, starter, active, position};
    }

    const minutes = Number(totals[labels.indexOf('MIN')]);

    const fg = totals[labels.indexOf('FG')];
    const fga = Number(fg.split('-')[1]);

    const ft = totals[labels.indexOf('FT')];
    const fta = Number(ft.split('-')[1]);

    const stats = {
      dnp,
      minutes,
      field_goal: fg,
      field_goal_attempts: fga,
      free_throw: ft,
      free_throw_attempts: fta,
      three_points: totals[labels.indexOf('3PT')],
      offensive_rebounds: Number(totals[labels.indexOf('OREB')]),
      defensive_rebounds: Number(totals[labels.indexOf('DREB')]),
      rebounds: Number(totals[labels.indexOf('REB')]),
      assists: Number(totals[labels.indexOf('AST')]),
      personal_fouls: Number(totals[labels.indexOf('PF')]),
      steals: Number(totals[labels.indexOf('STL')]),
      turnovers: Number(totals[labels.indexOf('TO')]),
      blocks: Number(totals[labels.indexOf('BLK')]),
      points: Number(totals[labels.indexOf('PTS')]),
    };

    return {name, stats, starter, active, position};
  }
}
