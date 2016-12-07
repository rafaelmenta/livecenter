angular.module('livecenter').controller('MyPlayers', ['$scope', 'PlayerNotification', function($scope, PlayerNotification) {

  $scope.players = PlayerNotification.watchedPlayers;
  $scope.remove = PlayerNotification.removePlayer;

  $scope.$watch('players()', function(newPlayers, oldPlayers) {
    PlayerNotification.updatePlayers(newPlayers);
  }, true);

}]);
