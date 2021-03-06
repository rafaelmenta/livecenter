app.service('PlayerNotification', ['$window', 'Storage', function($window, Storage) {

  var Notification = $window.Notification || {};

  var watchedPlayers;
  var lastStat = {};

  var DEFAULT_OPTIONS = {
    points : true,
    fouls : true,
    turnovers : true,
    steals : true,
    blocks : true,
    assists : true,
    defRebs : true,
    offRebs : true
  };

  // private

  var getPersistedPlayers = function() {
    var players = Storage.getItem('players', true);
    return players;
  }

  var initNotificatonPlayers = function() {
    watchedPlayers = JSON.parse(getPersistedPlayers());
    if (!watchedPlayers) watchedPlayers = {};
  };

  var getActivity = function(player, options) {
    var activity = [];
    var last = lastStat[player.profile.playerId];
    if (last) {
      var stat = player.statTotal;
      if (options.points && stat.points > last.points) activity.push('PTS');
      if (options.fouls && stat.fouls > last.fouls) activity.push('F');
      if (options.turnovers && stat.turnovers > last.turnovers) activity.push('TO');
      if (options.steals && stat.steals > last.steals) activity.push('STL');
      if (options.blocks && stat.blocks > last.blocks) activity.push('BLK');
      if (options.assists && stat.assists > last.assists) activity.push('AST');
      if (options.defRebs && stat.defRebs > last.defRebs) activity.push('D REB');
      if (options.offRebs && stat.offRebs > last.offRebs) activity.push('O REB');

    }

    return activity;
  };

  var updateStatus = function(player) {
    var options = watchedPlayers[player.profile.playerId].options;
    var activity = getActivity(player, options);
    lastStat[player.profile.playerId] = player.statTotal;
    return activity;
  };

  var loadPlayerNotifications = function(player) {
    var watchedPlayer = watchedPlayers[player.profile.playerId];
    if (watchedPlayer) {
      var activity = updateStatus(player, watchedPlayer.options);
      if (activity.length > 0) {
        var message = 'Nova atualização de ' + player.profile.displayName + ': ' + activity.join(', ');
        return message;
      }
      return false;
    }
    return false;
  };

  var loadGameNotifications = function(game) {
    var notifications = [];
    game.homeTeam.gamePlayers.forEach(function(player) {
      var notification = loadPlayerNotifications(player);
      if (notification) {
        notifications.push(notification);
      }
    });

    game.awayTeam.gamePlayers.forEach(function(player) {
      var notification = loadPlayerNotifications(player);
      if (notification) {
        notifications.push(notification);
      }
    });

    return notifications;
  };

  var loadGamesNotifications = function(games) {
    var notifications = [];
    games.forEach(function(game) {
      notifications = notifications.concat(loadGameNotifications(game));
    });

    return notifications;
  };

  var addPlayer = function(player) {
    var id = player.profile.playerId;

    watchedPlayers[id] = player;
    watchedPlayers[id].options = angular.copy(DEFAULT_OPTIONS);
  };

  var savePlayers = function(players) {
    Storage.setItem('players', JSON.stringify(players), true);
  }

  // public

  var notify = function(msg) {
    var n = new Notification(msg);
  };

  var togglePlayer = function(player) {
    var id = player.profile.playerId;
    if (watchedPlayers[id]) {
      delete watchedPlayers[id];
    } else {
      addPlayer(player);
    }

    savePlayers(watchedPlayers);
  };

  var getWatchedPlayers = function() {
    return watchedPlayers;
  };

  var sendNotifications = function(games) {
    var notifications = loadGamesNotifications(games);
    notifications.forEach(notify);
  };

  var removePlayer = function(player) {
    togglePlayer(player);
  };

  var updatePlayers = function(players) {
    savePlayers(players);
  };

  var getPermission = function() {
    var permission = Notification.permission;
    return permission;
  };

  initNotificatonPlayers();

  return {
    notify : notify,
    togglePlayer : togglePlayer,
    watchedPlayers : getWatchedPlayers,
    send : sendNotifications,
    removePlayer : removePlayer,
    updatePlayers : updatePlayers,
    getPermission : getPermission
  };

}]);
