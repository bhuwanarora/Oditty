homeApp.controller('rightController', ["$scope", "$timeout", "$mdSidenav", "$log", function($scope, $timeout, $mdSidenav, $log){
  $scope.close = function() {
    $mdSidenav('right').close();
  };
}]);