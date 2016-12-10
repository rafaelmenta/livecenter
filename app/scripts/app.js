var app = angular.module('livecenter', ['ui.router']);

app.config(function() {
  Date.prototype.stdTimezoneOffset = function() {
  var jan = new Date(this.getFullYear(), 0, 1);
  var jul = new Date(this.getFullYear(), 6, 1);
  return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  };

  Date.prototype.dst = function() {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
  };
});

app.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider
    .state('boxscore', {
      url : '/',
      templateUrl: '../views/boxscore.html',
      controller: 'Home'
    })
    .state('myplayers', {
      url : '/meus-jogadores',
      templateUrl: '../views/myplayers.html',
      controller: 'MyPlayers'
    })
    .state('settings', {
      url : '/configuracoes',
      templateUrl : '../views/settings.html',
      controller : 'Settings'
    });
}]);
