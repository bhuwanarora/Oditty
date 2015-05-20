homeApp.directive('bookInfo', ["$rootScope", "bookService", function($rootScope, bookService){
    return {
        restrict: 'E',
        scope : {book: '='},
        controller: ["$scope", function($scope){

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

homeApp.directive('communityInfo', ["$rootScope", "communityService", 'ColorConstants', function($rootScope, communityService, ColorConstants){
    return {
        restrict: 'E',
        scope : {community: '='},
        controller: ["$scope", function($scope){
            var _init = function(){
                $scope.community_loading = true;
                communityService.get_community_details($scope.community.id).then(function(data){
                    data = data[0].most_important_tag[0];
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