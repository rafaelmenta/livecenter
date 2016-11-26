angular.module('livecenter').constant('API', {
  GAMES : 'http://www.draftbrasil.net/superliga/bdb/get_date_games',
  BOX : 'http://api.draftbrasil.net/nba/boxscore/'
});

angular.module('livecenter').constant('DEFAULT_SETTINGS', {
  LOOP_TIME : 5000
});
