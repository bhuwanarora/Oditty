homeApp.controller('realVirtualityController', ["$scope", "$rootScope", "bookService", function($scope, $rootScope, bookService){

	$scope.change_news = function(){
		
	}

    var _init = (function(){
        var book_id = $rootScope.active_book.book_id;
        $scope.book_loading = true;
        $scope.info.loading = true;
        bookService.get_real_news(book_id).then(function(data){
            $scope.book_loading = false;
            $scope.info.loading = false;
            $scope.communities = data;
            $scope.active_community = data[0];
        });
    }());
}]);