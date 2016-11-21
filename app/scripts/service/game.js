angular.module('livecenter').service('Game', function($q, $http, PlayerNotification, API, Storage) {

  var GAMES_API = API.GAMES;
  var API = API.BOX;

  var games, gameMap, startedGames = {};

  var GAME_STATUS = {
    SCHEDULED : '1',
    ONGOING : '2',
    FINAL : '3'
  };

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
  };

  var saveStorage = function(games) {
    var gamesString = JSON.stringify(games);
    Storage.setItem('games', gamesString);
  };

  var getStorage = function() {
    var gamesString = Storage.getItem('games');
    return gamesString ? JSON.parse(gamesString) : null;
  }

  var getDateGames = function() {
    var deferred = $q.defer();
    var promise = deferred.promise;

    if (games) {
      deferred.resolve(games);
    } else {
      var gamesStorage = getStorage();
      if (gamesStorage) {
        games = gamesStorage;
        deferred.resolve(gamesStorage);
      } else {
        $http.get(GAMES_API).then(function(response) {
          var gamesResponse = response.data.games;
          saveStorage(gamesResponse);
          games = gamesResponse;
          deferred.resolve(gamesResponse);
        });
      }
    }

    return deferred.promise;
  };

  var updateGameMap = function() {
	var now = new Date();
	var timezone = now.dst() ? ' EDT' : ' EST'

  	games.forEach(function(game) {
  	  var gameTime = new Date(game.game_time + timezone);
  	  if (!gameMap[game.external_id] && now >= gameTime) {
  	  	startedGames[game.external_id] = true;
  	  }
  	});
  }

  // public

  var isGameLive = function(game) {
    return game.boxscore.status === GAME_STATUS.ONGOING;
  }

  var getGames = function() {

    return getDateGames().then(function(games) {
      var gameIds = games.map(function(game) { return game.external_id });

      if (gameMap) {
      	updateGameMap();
        var updateables = Object.keys(gameMap).filter(function(id) {
          return isGameLive(gameMap[id]);
        });

        var started = Object.keys(startedGames).forEach(function(id) {
          updateables.push(id);
        })

        return getGameResults(updateables);
      }

      gameMap = {};
      return getGameResults(gameIds);
    });
  };

  return {
    getGames : getGames,
    isGameLive : isGameLive
  };
});
