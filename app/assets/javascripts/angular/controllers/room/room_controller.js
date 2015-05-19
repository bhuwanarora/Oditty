homeApp.controller('roomController', ["$scope", "$rootScope", "$timeout", 'roomService', 'ColorConstants', function($scope, $rootScope, $timeout, roomService, ColorConstants){
	$scope.add_books_to_shelf = function(shelf, event){
		$rootScope.active_shelf = shelf;
		$scope.info.show_book_share = true;
	}
	
	var _init = (function(){
		
	}());

}]);