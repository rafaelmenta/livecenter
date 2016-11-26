angular.module('livecenter').service('Game', function($q, $http, PlayerNotification, API, Storage, Datepicker, $filter) {

  var GAMES_API = API.GAMES;
  var API = API.BOX;

  var currentDate,
      scheduleGames,
      gameResults;

  var GAME_STATUS = {
    SCHEDULED : '1',
    ONGOING : '2',
    FINAL : '3'
  };

  var dateFilter = $filter('date');

  // private

  var getBoxScore = function(gameId) {
    return $http.get(API + gameId).then(function(data) { return data.data.payload});
  };

  var getGameResults = function(ids, live) {
    var deferred = $q.defer();
    var promise = deferred.promise;
    var games;

    var liveMap = {};

    if (live) {
      games = live.map(function(game) {
        liveMap[game.gameProfile.gameId] = true;
        return getBoxScore(game);
      });

      ids.forEach(function(game) {
        if (!liveMap[game] && gameResults[game]) {
          games.push(gameResults[game]);
        } else {
          games.push(getBoxScore(game));
        }
      })

    } else {
      games = ids.map(function(game) {
        return getBoxScore(game);
      });
    }


    $q.all(games).then(function(results) {
      gameResults = {};
      results.map(function(game) {
        gameResults[game.gameProfile.gameId] = game;
      });

      PlayerNotification.send(results);
      deferred.resolve(gameResults);
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

    var shouldRefresh = Date.parse(date) !== Date.parse(currentDate);
    var gamesStorage = getStorage();
    var url = GAMES_API;

    var info = {
      date : date
    };

    if (scheduleGames && !shouldRefresh) {
      info.games = scheduleGames;
      deferred.resolve(info);
    } else if (gamesStorage && !shouldRefresh) {
      scheduleGames = gamesStorage;
      info.games = games;
      deferred.resolve(info);
    } else {
      if (date) url += '/' + dateFilter(date, 'yyyy-M-d');

      $http.get(url).then(function(response) {
      currentDate = date;
        var gamesResponse = response.data.games;
        if (!date) {
          saveStorage(gamesResponse);
        }
        scheduleGames = gamesResponse;
        info.games = gamesResponse;
        deferred.resolve(info);
      });
    }

    return deferred.promise;
  };

  var getStartedGames = function(games) {
    var now = new Date();
    var timezone = now.dst() ? ' EDT' : ' EST'

    var startedGames = games.filter(function(game) {
      var gameTime = new Date(game.game_time + timezone);
      var result = gameResults && gameResults[game.external_id];
      return result && result.boxscore.status === GAME_STATUS.SCHEDULED && now >= gameTime;
    });

    return startedGames;
  };

  var getUpdteableGames = function(startedGames) {
  	var updateables = gameResults ? Object.keys(gameResults).filter(function(id) {
      return isGameLive(gameResults[id]);
    }) : [];

    Object.keys(startedGames).forEach(function(id) {
      updateables.push(id);
    });

    return updateables;
  }

  var getResults = function(info) {
    var shouldUpdateIds = !info.date || Date.parse(info.date) === Date.parse(Datepicker.getToday());

    var gameIds = info.games.map(function(game) { return game.external_id });
    var liveGames;

    if (gameResults && shouldUpdateIds) {
      var startedGames = getStartedGames(info.games);
      liveGames = getUpdteableGames(startedGames);
    }

    return getGameResults(gameIds, liveGames);
  }

  // public

  var isGameLive = function(game) {
    return game.boxscore.status === GAME_STATUS.ONGOING;
  };

  var isFutureGame = function(game) {
  	return game.boxscore.status === GAME_STATUS.SCHEDULED;
  }

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

  var clearGameMap = function() {
    gameMap = {};
  }

  return {
    getGames : getGames,
    isGameLive : isGameLive,
    isFutureGame : isFutureGame,
    isWinner : isWinner,
    clearGameMap : clearGameMap
  };
});
