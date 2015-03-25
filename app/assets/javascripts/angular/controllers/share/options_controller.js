homeApp.controller('optionsController', ["$scope", "$rootScope", "$timeout", 'ShareOptions', '$routeParams', '$mdBottomSheet', function($scope, $rootScope, $timeout, ShareOptions, $routeParams, $mdBottomSheet){

    var _init = function(){
        $scope.share_options = ShareOptions;
        $scope.data = {
            selectedIndex : 0     
        };
    }

    $scope.show_level1_options = function(option, event){
        $scope.first_option = option;
        delete $scope.second_option;
        delete $scope.level2_nested_options;
        $scope.add_books = false;
        $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2) ;

        $scope.loading = true;
        angular.forEach(ShareOptions.ReadingStage, function(value){
            if(angular.equals(value, option)){
                var timeout_event = $timeout(function(){
                    $scope.loading = false;
                    $scope.nested_options = option.nested_options;
                }, 1000);
                $scope.$on('destroy', function(){
                    $timeout.cancel(timeout_event);
                });
            }
        });
        event.stopPropagation();
    }

    $scope.show_level2_options = function(option, event){
        $scope.second_option = option;
        $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2) ;
        $scope.level2_loading = true;
        if(angular.isDefined($scope.second_option.search_book)){
                $scope.add_books = true;
            delete $scope.level2_nested_options;
        }
        else{
            var timeout_event = $timeout(function(){
                $scope.add_books = false;
                $scope.level2_loading = false;
                $scope.level2_nested_options = $scope.second_option.value;
            }, 1000);
        }
        event.stopPropagation();
    }

    $scope.post_status = function(option, event){

    }

    $scope.previous = function() {
        $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
    };

    _init();
}]);