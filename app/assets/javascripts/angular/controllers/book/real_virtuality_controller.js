homeApp.controller('realVirtualityController', ["$scope", "$rootScope", "$timeout", "bookService", '$mdToast', '$location', '$mdBottomSheet', function($scope, $rootScope, $timeout, bookService, $mdToast, $location, $mdBottomSheet){

    var _init = (function(){
        var book_id = $rootScope.active_book.book_id;
        bookService.get_real_news(book_id).then(function(data){
            $scope.communities = data;
            $scope.active_community = data[0];
        });
    }());
}]);