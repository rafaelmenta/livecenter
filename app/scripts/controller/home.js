angular.module('livecenter').controller('Home', function($scope, $timeout, Game, PlayerNotification) {

  $scope.greet = 'hi';
  $scope.games = {};
  $scope.myPlayers = PlayerNotification.watchedPlayers;
  $scope.isWinner = function(game, teamId) {
    return {
      'winner' : Game.isWinner(game, teamId)
    }
  };

  // @TODO move to a service
  $scope.dates = [];
  for (var i = -2; i <= 2; ++i) {
    var date = new Date();
    date.setDate(date.getDate() + i);
    $scope.dates.push({
      date : date,
      isSelected : false
    });
  }

  $scope.dates[2].isSelected = true;

  // ENDTODO

  var gameLoop = function() {

  	Game.getGames().then(function(data) {
  	  $scope.games = angular.extend($scope.games, data);

      if ($scope.selectedGame) {
        $scope.selectGame($scope.selectedGame.gameProfile.gameId)
      }
    });

    $timeout(gameLoop, 5000);

  };

  $scope.togglePlayer = function(player) {
    PlayerNotification.togglePlayer(player);
  }

  $scope.selectGame = function(id) {
    $scope.selectedGame = $scope.games[id];
  };

  $scope.courtStatus = function(profile) {
    return {
      'starter': profile.isStarter === 'true',
      'on-court':  profile.onCourt === 'true'
    };

  };

  gameLoop();

  $scope.isLive = Game.isGameLive;
});
