homeApp.controller('roomController', ["$scope", "$rootScope", "$timeout", 'roomService', function($scope, $rootScope, $timeout, roomService){
	var _init = function(){
		roomService.get_books_grouped_by_shelves().then(function(data){
			$scope.books_grouped_by_shelves = data;
		});
		roomService.get_articles_grouped_by_shelves().then(function(data){
			$scope.articles_grouped_by_shelves = data;
		});
		roomService.get_visited_articles().then(function(data){
			$scope.visited_articles = data;
		});
		roomService.get_visited_books().then(function(data){
			$scope.visited_books = data;
		});
	};

	_init();
}]);