app.controller('Home', [
  '$scope', '$timeout', 'Game', 'PlayerNotification', 'Datepicker', 'UserSettings',
  function($scope, $timeout, Game, PlayerNotification, Datepicker, UserSettings) {

  $scope.isWinner = function(game, teamId) {
    return {
      'winner' : Game.isWinner(game, teamId)
    }
  };

  $scope.isToday = function() {
    return !$scope.selectedDate || Datepicker.isEqual(Datepicker.getToday(), $scope.selectedDate);
  };

  $scope.selectToday = function() {
    $scope.selectDate(Datepicker.getToday());
    Datepicker.resetCarousel();
  }

  var timer;
  $scope.selectDate = function(date) {
    $timeout.cancel(timer);
    Datepicker.selectDate(date);
    $scope.selectedDate = date;
    $scope.selectedGame = null;
    $scope.isLoading = true;
    gameLoop();
  }

  var gameLoop = function() {
    Game.getGames($scope.selectedDate).then(function(data) {
      $scope.games = data;
      $scope.isLoading = false;

      if ($scope.selectedGame) {
        $scope.selectGame($scope.selectedGame.gameProfile.gameId)
      }
    });

    timer = $timeout(gameLoop, UserSettings.settings.LOOP_TIME);
  };

  $scope.togglePlayer = function(player) {
    PlayerNotification.togglePlayer(player);
  }

  $scope.selectGame = function(id) {
    var game = $scope.games[id];
    if (!Game.isFutureGame(game)) {
      $scope.selectedGame = game;
    }
  };

  $scope.winnerScore = function(team) {
    var home = $scope.selectedGame.homeTeam,
        away = $scope.selectedGame.awayTeam;
    if (home.profile.id === team.profile.id) {
      return team.score.score > away.score.score ? 1 : -1;
    }
    return team.score.score > home.score.score ? 1 : -1;
  }

  $scope.courtStatus = function(profile) {
    return {
      'starter': profile.isStarter === 'true',
      'on-court':  profile.onCourt === 'true'
    };
  };

  // init
  (function() {
    $scope.games = {};
    $scope.myPlayers = PlayerNotification.watchedPlayers;
    Datepicker.selectDate();
    $scope.dates = Datepicker.getCarousel;
    $scope.rotate = Datepicker.rotateCarousel;
    $scope.isSelected = Datepicker.isDateSelected;
    $scope.isLive = Game.isGameLive;
    $scope.isFutureGame = Game.isFutureGame;

    gameLoop();
  })();
}]);
