import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GameService, GameData, GAME_STATE } from 'src/app/service/game.service';
import { Observable, timer } from 'rxjs';
import { flatMap, takeWhile, tap } from 'rxjs/operators';

/**
 * Frequency of game data polling
 */
const POLLING_INTERVAL = 5000;

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.css']
})
export class GameCardComponent implements OnInit {

  /**
   * Game external ID
   */
  @Input() gameId: string;

  /**
   * Whether the game card is selected or not
   */
  @Input() selected = false;

  /**
   * Emits an event with the game data information up selection
   */
  @Output() gameSelected = new EventEmitter<GameData>();

  /**
   * Emits an event with the latest update on game data
   */
  @Output() gameUpdated = new EventEmitter<GameData>();

  /**
   * Game stream
   */
  game$: Observable<GameData>;

  constructor(
    private readonly gameService: GameService,
  ) { }

  ngOnInit() {
    this.game$ = timer(0, POLLING_INTERVAL).pipe(
      flatMap(() => this.gameService.getGameData(this.gameId)),
      tap(game => this.gameUpdated.emit(game)),
      takeWhile(game => this.isGamePending(game)),
    );
  }

  onGameSelection(game: GameData) {
    this.gameSelected.emit(game);
  }

  // RxJS prior to 6.4.0 doesn't accept the `inclusive` argument on takeWhile operator.
  // Since versions 6.4.0 and above have a typescript issue with Angular CLI, using this workaround
  // to let the very last
  private realLast = false;

  /**
   * Whether or not a game has not finished yet.
   * @see realLast notes for a workaround related to RxJS typing malfunction.
   *
   * @param game game being evaluated
   *
   * @return true if game is pending
   */
  private isGamePending(game: GameData) {
    const isPending = game.boxscore.status !== GAME_STATE.FINAL;

    // Workaround for not being able to use takeWhile with the inclusive flag
    if (!isPending && !this.realLast) {
      this.realLast = true;
      return true;
    }
    return isPending;
  }

}
