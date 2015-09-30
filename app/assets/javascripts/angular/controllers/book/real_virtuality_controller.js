homeApp.controller('realVirtualityController', ["$scope", "$rootScope", "bookService", "$location", "userService", function($scope, $rootScope, bookService, $location, userService){

    var _init = (function(){
        if(angular.isDefined($rootScope.active_book)){
            
            var book_id = $rootScope.active_book.book_id;
            bookService.get_real_news(book_id).then(function(data){
                if(data != null){
                    $scope.rooms = data.communities;
                }
            });
        }
        else{
            $location.path( "/book/timeline" );
        }

    }());

}]);