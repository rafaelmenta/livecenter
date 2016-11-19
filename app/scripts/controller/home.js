angular.module('livecenter').controller('Home', function($scope, $timeout, Game) {
  
  $scope.greet = 'hi';

  var gameLoop = function() {

  	console.log('Calling game loop');
  	Game.getGames().then(function(data) {
  	  $scope.games = data;
    });

    // $timeout(gameLoop, 5000);

  };

  gameLoop();

  $scope.isLive = Game.isGameLive;
});