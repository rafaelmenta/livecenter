angular.module('livecenter').service('Game', function($q, $http, PlayerNotification, API, Storage, $filter) {

  var GAMES_API = API.GAMES;
  var API = API.BOX;

  var gamesDate, games, gameMap, startedGames = {};

  var GAME_STATUS = {
    SCHEDULED : '1',
    ONGOING : '2',
    FINAL : '3'
  };

  var dateFilter = $filter('date');

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

  var getDateGames = function(date) {
    var deferred = $q.defer();
    var promise = deferred.promise;

    if (games && date === gamesDate) {
      deferred.resolve(games);
    } else {
      var gamesStorage = getStorage();
      if (gamesStorage && date === gamesDate) {
        games = gamesStorage;
        deferred.resolve(gamesStorage);
      } else {
        gamesDate = date;
        var url = GAMES_API;
        if (gamesDate) url += '/' + dateFilter(gamesDate, 'yyyy-M-d');

        $http.get(url).then(function(response) {
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

	if (games) {
      games.forEach(function(game) {
        var gameTime = new Date(game.game_time + timezone);
        if (gameMap[game.external_id] && gameMap[game.external_id].boxscore.status === GAME_STATUS.SCHEDULED && now >= gameTime) {
          startedGames[game.external_id] = true;
        }
      });
    }
  }

  // public

  var isGameLive = function(game) {
    return game.boxscore.status === GAME_STATUS.ONGOING;
  };

  var isWinner = function(game, teamId) {
    var away = {
      id : game.gameProfile.awayTeamId,
      score : game.boxscore.awayScore
    };

    var home = {
      id : game.gameProfile.homeTeamId,
      score : game.boxscore.homeScore
    };

    return game.boxscore.status === GAME_STATUS.FINAL &&
      ((teamId === away.id && away.score > home.score) ||
       (teamId === home.id && home.score > away.score));

  };

  var getGames = function(date) {
    var shouldRefresh = date !== gamesDate;
    return getDateGames(date).then(function(games) {
      var gameIds = games.map(function(game) { return game.external_id });

      if (gameMap && !shouldRefresh) {
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
    isGameLive : isGameLive,
    isWinner : isWinner
  };
});
