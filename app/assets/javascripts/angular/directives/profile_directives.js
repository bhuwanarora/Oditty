

homeApp.directive('communityInfo', ["$rootScope", "newsService", 'ColorConstants', '$mdDialog', function($rootScope, newsService, ColorConstants, $mdDialog){
    return {
        restrict: 'E',
        scope : {community: '=', info: '='},
        controller: ["$scope", function($scope){
            $scope.show_book_dialog = function(book, event){
                $rootScope.active_book = book;
                $rootScope.active_book.show_info_only = true;
                $mdDialog.show({
                    templateUrl: '/assets/angular/html/news/book.html',
                    scope: $scope,
                    preserveScope: true,
                    clickOutsideToClose: true,
                    targetEvent: event
                });
                event.stopPropagation();
            }

            var _init = function(){
                if(angular.isDefined($scope.community)){
                    $scope.community_loading = true;
                    newsService.get_feed_info($scope.community.id).then(function(data){
                        $scope.community = angular.extend($scope.community, data);
                        angular.forEach($scope.community.books, function(book){
                            var random_int = Math.floor(Math.random()*ColorConstants.value.length);
                            var color = ColorConstants.value[random_int];
                            book.color = color;
                        });
                        $scope.community_loading = false;
                    });
                }
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/shared/partials/community_info.html'
    };
}]);