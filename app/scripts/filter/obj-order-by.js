angular.module('livecenter').filter('objOrderBy', function() {
  return function(items, field, reverse) {
    var filtered = Object.keys(items).map(function(item) { return items[item]});

    var index = function(obj, i) { return obj[i]; };

    filtered.sort(function(a, b) {
      var aValue = field.split('.').reduce(index, a);
      var bValue = field.split('.').reduce(index, b);
      return aValue > bValue ? 1 : -1;
    });

    if (reverse) filtered.reverse();

    return filtered
  }
});
