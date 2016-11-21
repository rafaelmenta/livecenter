angular.module('livecenter').service('Storage', function($window) {
  
  var localStorage = $window.localStorage;

  var isStorageAvailable = function() {
  	return localStorage && localStorage.setItem && localStorage.getItem;
  };

  var setItem = function(key, item) {
  	if (!isStorageAvailable) return false;

  	localStorage.setItem(key, item);
  	return true;
  }

  var getItem = function(key) {
  	if (!isStorageAvailable) return null;

  	return localStorage.getItem(key);
  };

  return {
  	setItem : setItem,
  	getItem : getItem
  };

});