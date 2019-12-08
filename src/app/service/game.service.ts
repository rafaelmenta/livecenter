import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GameService {

  private GAMES_API = environment.API.GAMES;

  private DATA_API = environment.API.BOX;

  private pipe = new DatePipe('en-us');

  constructor(
    private readonly http: HttpClient,
  ) { }

  getDateGames(date: Date) {
    const gameDate = this.pipe.transform(date, 'yyyy-M-d');
    return this.http.get<{games: GameInfo[]}>(`${this.GAMES_API}/${gameDate}`);
  }

  getGameData(gameId: string) {
    return this.http.get<RawGameData>(`${this.DATA_API}/${gameId}`).pipe(map(res => res.payload));
  }
}

export interface GameInfo {
  external_id: string;
  game_time: string;
  id_away: string;
  id_home: string;
}

export interface GameData {
  boxscore: {
    status: GAME_STATE,
    awayScore: string;
    homeScore: string;
  };
  gameProfile: {
    awayTeamId: string;
    homeTeamId: string;
    gameId: string;
  };
  awayTeam: TeamData;
  homeTeam: TeamData;
}

export interface TeamData {
  profile: {
    id: string;
  };
  score: {
    score: number;
  };
}

export enum GAME_STATE {
  SCHEDULED = '1',
  ONGOING = '2',
  FINAL = '3',
};


interface RawGameData {
  payload: GameData;
}