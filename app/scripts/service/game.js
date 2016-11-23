angular.module('livecenter').service('Game', function($q, $http, PlayerNotification, API, Storage, Datepicker, $filter) {

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
    var shouldRefresh = date !== gamesDate;
    var gamesStorage = getStorage();
    var url = GAMES_API;

    var info = {
      date : date
    };

    if (games && !shouldRefresh) {
      info.games = games;
      deferred.resolve(info);      
    } else if (gamesStorage && !shouldRefresh) {
      games = gamesStorage;
      info.games = games;
      deferred.resolve(info);
    } else {
      if (date) url += '/' + dateFilter(date, 'yyyy-M-d');
      $http.get(url).then(function(response) {
	    gamesDate = date;
        var gamesResponse = response.data.games;
        if (!date) {
          saveStorage(gamesResponse);
        }
        games = gamesResponse;
        info.games = gamesResponse;
        deferred.resolve(info);
      });
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
  };

  var getUpdteableGames = function() {
  	var updateables = Object.keys(gameMap).filter(function(id) {
      return isGameLive(gameMap[id]);
    });
    
    Object.keys(startedGames).forEach(function(id) {
      updateables.push(id);
    });

    return updateables;
  }

  var getResults = function(info) {
  	if (info.games) {
  	  var shouldRefresh = !info.date || info.date === Datepicker.getToday();
      var gameIds = info.games.map(function(game) { return game.external_id });

      if (gameMap && shouldRefresh) {
        updateGameMap();
        gameIds = getUpdteableGames();
      } else {
        gameMap = {};
      }

      return getGameResults(gameIds);
    }

    var errorObj = {
      error : true,
      info : 'info.games not found'
    };
    return errorObj;
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
    var dateGames = getDateGames(date).then(getResults);
    return dateGames;
  };

  return {
    getGames : getGames,
    isGameLive : isGameLive,
    isWinner : isWinner
  };
});
