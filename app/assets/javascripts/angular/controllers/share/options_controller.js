homeApp.controller('optionsController', ["$scope", "$rootScope", "$timeout", 'ShareOptions', '$routeParams', '$mdBottomSheet', function($scope, $rootScope, $timeout, ShareOptions, $routeParams, $mdBottomSheet){

    var _init = function(){
        $scope.share_options = ShareOptions;
        $scope.nested_options = [];
    }

    $scope.show_nested_options = function(option, event){
        $scope.nested_options = [];
        angular.forEach(ShareOptions.ReadingStage, function(value){
            if(angular.equals(value, option)){
                $scope.nested_options = option.nested_options;
            }
        });
        event.stopPropagation();
    }

    _init();
}]);