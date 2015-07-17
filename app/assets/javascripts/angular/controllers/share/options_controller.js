homeApp.controller('optionsController', ["$scope", "$rootScope", "$timeout", 'ShareOptions', '$routeParams', '$mdBottomSheet', function($scope, $rootScope, $timeout, ShareOptions, $routeParams, $mdBottomSheet){

    var _init = (function(){
        $scope.share_options = ShareOptions;
        $scope.data = {
            selectedIndex : 0     
        };
    }());

    $scope.show_level1_options = function(option, index, event){
        $scope.first_option = option;
        delete $scope.second_option;
        delete $scope.level2_nested_options;
        delete $scope.info.book_exchange_status;
        delete $scope.info.feelings;
        $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2);
        $scope.info.reading_status_value = index;

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
    }

    $scope.show_level2_options = function(option, index, event){
        delete $scope.info.feelings;

        $scope.second_option = option;
        $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2) ;
        $scope.info.book_exchange_status = index;
        $scope.level2_loading = true;
        if(angular.isDefined($scope.second_option.search_book)){
            delete $scope.level2_nested_options;
        }
        else{
            var timeout_event = $timeout(function(){
                $scope.level2_loading = false;
                $scope.level2_nested_options = $scope.second_option.value;
            }, 1000);
        }
    }

    $scope.post_status = function(option, event){
        $scope.info.feelings = [option.name];
    }

    $scope.previous = function() {
        $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
    };

}]);