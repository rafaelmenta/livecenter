angular.module('livecenter').service('PlayerNotification', function($window) {

  var Notification = $window.Notification;
  var permission;

  var watchedPlayers = {};
  var lastStat = {};

  Notification.requestPermission(function(result) {
    permission = result;
  });

  // private

  var getActivity = function(player) {
    var activity = [];
    var last = lastStat[player.profile.playerId];

    if (last) {
      var stat = player.statTotal;
      if (stat.points > last.points) activity.push('Score');
      if (stat.fouls > last.fouls) activity.push('Foul');
      if (stat.turnovers > last.turnovers) activity.push('Turnover');
      if (stat.steals > last.steals) activity.push('Steal');
      if (stat.blocks > last.blocks) activity.push('Block');
      if (stat.assists > last.assists) activity.push('Assist');
      if (stat.defRebs > last.defRebs) activity.push('Def Reb');
      if (stat.offRebs > last.offRebs) activity.push('Off Reb');

    }

    return activity;
  };

  var updateStatus = function(player) {
    var activity = getActivity(player);
    lastStat[player.profile.playerId] = player.statTotal;
    return activity;
  };

  var loadPlayerNotifications = function(player) {
    if (watchedPlayers[player.profile.playerId]) {
      var activity = updateStatus(player);
      if (activity.length > 0) {
        var message = 'New updates for ' + player.profile.displayName + ': ' + activity.join(', ');
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
      notifications = loadGameNotifications(game);
    });

    return notifications;
  }

  // public

  var notify = function(msg) {
    console.log('notifying msg', msg);
    var n = new Notification(msg);
  };

  var togglePlayer = function(player) {
   watchedPlayers[player.profile.playerId] = !watchedPlayers[player.profile.playerId];
  };

  var getWatchedPlayers = function() {
    return watchedPlayers;
  };

  var sendNotifications = function(games) {
    var notifications = loadGamesNotifications(games);

    notifications.forEach(function(msg) {
      notify(msg);
    })
  };

  // var requestPermission = function()

  return {
    notify : notify,
    togglePlayer : togglePlayer,
    watchedPlayers : getWatchedPlayers,
    send : sendNotifications
  };

});
