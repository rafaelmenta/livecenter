angular.module('livecenter').controller('Home', function($scope, $timeout, Game, PlayerNotification, Datepicker) {

  $scope.games = {};
  $scope.myPlayers = PlayerNotification.watchedPlayers;
  $scope.isWinner = function(game, teamId) {
    return {
      'winner' : Game.isWinner(game, teamId)
    }
  };

  $scope.isToday = function() {
    return !$scope.selectedDate || Datepicker.isEqual(Datepicker.getToday(), $scope.selectedDate);
  };

  Datepicker.selectDate();
  $scope.dates = Datepicker.getCarousel;
  $scope.rotate = Datepicker.rotateCarousel;
  $scope.isSelected = Datepicker.isDateSelected;

  var timer;

  $scope.selectToday = function() {
    $scope.selectDate(Datepicker.getToday());
    Datepicker.resetCarousel();
  }

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

    timer = $timeout(gameLoop, 5000);

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

  $scope.courtStatus = function(profile) {
    return {
      'starter': profile.isStarter === 'true',
      'on-court':  profile.onCourt === 'true'
    };

  };

  gameLoop();

  $scope.isLive = Game.isGameLive;
  $scope.isFutureGame = Game.isFutureGame;
});
