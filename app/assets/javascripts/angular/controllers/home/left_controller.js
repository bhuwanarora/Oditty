homeApp.controller('leftController', ["$scope", "$timeout", "$mdSidenav", "$log", function($scope, $timeout, $mdSidenav, $log){
  $scope.close = function() {
    $mdSidenav('left').close();
  };
}]);