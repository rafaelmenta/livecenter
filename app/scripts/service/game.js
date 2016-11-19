angular.module('livecenter').service('Game', function($q, $http, PlayerNotification) {

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

  var gameMap;

  // private

  var getBoxScore = function(gameId) {
    return $http.get(API, { params : { gameId : gameId } }).then(function(data) { return data.data.payload});
  };

  var getGameResults = function(ids) {
    var deferred = $q.defer();
    var promise = deferred.promise;

    var games = ids.map(function(game) {
      return getBoxScore(game);
    });

    $q.all(games).then(function(results) {
      results.map(function(game) {
        gameMap[game.gameProfile.gameId] = game;
      });

      PlayerNotification.send(results);
      deferred.resolve(gameMap);
    });

    return deferred.promise;
  }

  // public

  var isGameLive = function(game) {
    return game.boxscore.status === GAME_STATUS.ONGOING;
  }

  var getGames = function() {

    if (gameMap) {
      var updateables = Object.keys(gameMap).filter(function(id) {
        return isGameLive(gameMap[id]);
      });

      return getGameResults(updateables);
    }

    gameMap = {};
    return getGameResults(json.today);
  };

  return {
    getGames : getGames,
    isGameLive : isGameLive
  };
});
