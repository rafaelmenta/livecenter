angular.module('livecenter').controller('MyPlayers', function($scope, PlayerNotification) {

  $scope.players = PlayerNotification.watchedPlayers;
  $scope.remove = PlayerNotification.removePlayer;

});
