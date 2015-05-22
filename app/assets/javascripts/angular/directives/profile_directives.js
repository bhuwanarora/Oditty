homeApp.directive('bookInfo', ["$rootScope", "bookService", '$mdDialog', function($rootScope, bookService, $mdDialog){
    return {
        restrict: 'E',
        scope : {book: '=', info: '='},
        controller: ["$scope", function($scope){
            $scope.show_book_dialog = function(book, event){
                $rootScope.active_book = book;
                $rootScope.active_book.show_info_only = true;
                $mdDialog.show({
                    templateUrl: '/assets/angular/html/community/book.html',
                    scope: $scope,
                    preserveScope: true,
                    targetEvent: event,
                    clickOutsideToClose: true
                });
                event.stopPropagation();
            }

            var _init = function(){
                $scope.book_loading = true;
                bookService.get_basic_book_details($scope.book.id).then(function(data){
                    $scope.book = angular.extend($scope.book, data);
                    $scope.book_loading = false;
                });
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/shared/partials/book_info.html'
    };
}]);

homeApp.directive('communityInfo', ["$rootScope", "communityService", 'ColorConstants', '$mdDialog', function($rootScope, communityService, ColorConstants, $mdDialog){
    return {
        restrict: 'E',
        scope : {community: '=', info: '='},
        controller: ["$scope", function($scope){
            $scope.show_book_dialog = function(book, event){
                $rootScope.active_book = book;
                $rootScope.active_book.show_info_only = true;
                $mdDialog.show({
                    templateUrl: '/assets/angular/html/community/book.html',
                    scope: $scope,
                    preserveScope: true,
                    clickOutsideToClose: true,
                    targetEvent: event
                });
                event.stopPropagation();
            }

            var _init = function(){
                $scope.community_loading = true;
                communityService.get_feed_info($scope.community.id).then(function(data){
                    $scope.community = angular.extend($scope.community, data);
                    angular.forEach($scope.community.books, function(book){
                        var random_int = Math.floor(Math.random()*ColorConstants.value.length);
                        var color = ColorConstants.value[random_int];
                        book.color = color;
                    });
                    $scope.community_loading = false;
                });
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/shared/partials/community_info.html'
    };
}]);