app.controller('BowerController', ['$scope', function ($scope) {
  $scope.$watch('configs[branch.name].bower.config', function (value) {
    $scope.config = value;
  });
  $scope.saving = false;
  $scope.save = function () {
    $scope.saving = true;
    $scope.pluginConfig('bower', $scope.config, function () {
      $scope.saving = false;
    });
  };
}]);
