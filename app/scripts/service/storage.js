angular.module('livecenter').service('Storage', function($window) {

  var localStorage = $window.localStorage;

  // private

  var getTodayTimestamp = function() {
    var today = new Date();
    return today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate();
  }

  var updateTimestamp = function() {
    var timestamp = getTodayTimestamp();
    localStorage.setItem('timestamp', timestamp);
  }

  var isExpired = function() {
    var today = getTodayTimestamp();
    var timestamp = localStorage.getItem('timestamp');
    return today !== timestamp;
  }

  var isStorageAvailable = function() {
    return localStorage && localStorage.setItem && localStorage.getItem;
  };

  // public

  var setItem = function(key, item, noUpdate) {
    if (!isStorageAvailable) return false;

    localStorage.setItem(key, item);
    if (!noUpdate) {
      updateTimestamp();
    }
    return true;
  }

  var getItem = function(key, noExpire) {
    if (!isStorageAvailable || (!noExpire && isExpired()))  return null;
    return localStorage.getItem(key);
  };

  return {
    setItem : setItem,
    getItem : getItem,
    isExpired : isExpired
  };

});
