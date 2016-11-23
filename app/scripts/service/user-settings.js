angular.module('livecenter').service('UserSettings', function(DEFAULT_SETTINGS, Storage) {
  var settings = DEFAULT_SETTINGS;

  // public

  var updateSetting = function(key, value) {
  	settings[key] = value;
    Storage.setItem('settings', JSON.stringify(settings));
  };

  var getSettings = function() {
  	return settings
  };

  return {
  	getSettings : getSettings
  };
});