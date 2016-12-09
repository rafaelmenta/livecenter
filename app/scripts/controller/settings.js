app.controller('Settings', ['$scope', 'UserSettings', function($scope, UserSettings) {

  $scope.settings = UserSettings.settings;
  $scope.$watch('settings.LOOP_TIME', function(newV, oldV) {
    if (newV === oldV) return;
    $scope.changeStatus = UserSettings.updateLoopTime(newV);
  });

}]);
