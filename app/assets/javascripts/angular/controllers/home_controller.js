homeApp.controller('homeController', ["$scope", "$mdSidenav", function($scope, $mdSidenav){

    $scope.show_signin_options = function(event){
        $mdSidenav('signup').toggle();
        event.stopPropagation();
    }

}]);