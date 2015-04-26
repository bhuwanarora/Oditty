homeApp.controller('buyController', ["$scope", "$rootScope", "bookService", function($scope, $rootScope, bookService){
	var _init = (function(){
		var id = ($rootScope.active_book.id) || ($rootScope.active_book.book_id);
		bookService.get_borrow_users(id).then(function(data){
			$scope.borrow_users = data;
		});
	}());

}]);