homeApp.controller('buyController', ["$scope", "$rootScope", "bookService", "sharedService", function($scope, $rootScope, bookService, sharedService){
	var _init = (function(){
		var id = ($rootScope.active_book.id) || ($rootScope.active_book.book_id);
		if(angular.isUndefined($scope.book)){
			$scope.book = $rootScope.active_book;
		}
		$scope.book_loading = true;
		bookService.get_borrow_users(id).then(function(data){
			$scope.borrow_users = data;
			$scope.book_loading = false;
		});
	}());

	$scope.toggle_bookmark = function(status){
		var id = ($rootScope.active_book.id) || ($rootScope.active_book.book_id);
		var label = {"label_key": "IOwnThis"};
		$rootScope.bookmark_object = {"type": "Book", "id": id};
		sharedService.toggle_bookmark(label, status);
	}

}]);