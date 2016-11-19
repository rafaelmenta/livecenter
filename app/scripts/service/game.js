angular.module('livecenter').service('Game', function($q, $http) {
  
  var json = {
  today : [
    '0021600174',
    '0021600176',
    '0021600175',
    '0021600179',
    '0021600177',
    '0021600178',
    '0021600180',
    '0021600181',
    '0021600182',
    '0021600183'
  ]
};

  var API = 'https://crossorigin.me/http://au.global.nba.com/stats2/game/snapshotlive.json';

  var GAME_STATUS = {
  	SCHEDULED : '1',
  	ONGOING : '2',
  	FINAL : '3'
  };

  var isGameLive = function(game) {
  	return game.boxscore.status === GAME_STATUS.ONGOING;
  }

  var getBoxScore = function(gameId) {
  	return $http.get(API, { params : { gameId : gameId } }).then(function(data) { console.log(data); return data.data.payload});
  }

  var getGames = function() {
  	var deferred = $q.defer();
  	var promise = deferred.promise;

  	var games = json.today.map(function(game) {
  	  return getBoxScore(game);
  	});

  	$q.all(games).then(function(results) {
  		deferred.resolve(results);
  	});

  	return deferred.promise;
  };

  return { 
  	getGames : getGames,
  	isGameLive : isGameLive
  };
});