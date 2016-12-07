angular.module('livecenter').service('UserSettings', ['DEFAULT_SETTINGS', 'Storage', 'PlayerNotification', function(DEFAULT_SETTINGS, Storage, PlayerNotification) {
  var settings;

  var initDefaultSettings = function() {
    settings = angular.copy(DEFAULT_SETTINGS);
  };

  var initLoadedSettings = function() {
    var rawSettings = Storage.getItem('settings');
    if (!rawSettings) return null;
    settings = JSON.parse(rawSettings);
  };

  var initBroswerSettings = function() {
    settings.storage = {
      enabled : Storage.isStorageAvailable()
    };

    settings.notifications = {
      permission : PlayerNotification.getPermission()
    };
  };

  var init = function() {
    initLoadedSettings();
    if (!settings) initDefaultSettings();
    initBroswerSettings();
  }

  var updateSetting = function(key, value) {
    settings[key] = value;
    Storage.setItem('settings', JSON.stringify(settings));
  };

  init();

  // public

  var updateLoopTime = function(timeStr) {
    var time = parseInt(timeStr, 10);
    if (time < DEFAULT_SETTINGS.LOOP_TIME) return false;
    updateSetting('LOOP_TIME', time);
    return true;
  }

  return {
    settings : settings,
    updateLoopTime : updateLoopTime
  };
}]);
