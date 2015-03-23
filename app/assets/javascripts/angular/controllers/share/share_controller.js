homeApp.controller('shareController', ["$scope", "$rootScope", "$timeout", 'ShareOptions', '$routeParams', '$mdBottomSheet', function($scope, $rootScope, $timeout, ShareOptions, $routeParams, $mdBottomSheet){

    $scope.show_share_options = function(event){
        $mdBottomSheet.show({
            templateUrl: 'assets/angular/html/share/_share_options.html',
            controller: 'optionsController',
            targetEvent: event
        });
    };

    $scope.back = function($event){
        $scope.info.show_share = false;
        event.stopPropagation();
    }

    var _init = function(){
        $scope.info.show_share = true;
    }

    _init();
}]);