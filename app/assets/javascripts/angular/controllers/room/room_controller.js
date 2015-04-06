homeApp.controller('roomController', ["$scope", "$rootScope", "$timeout", 'roomService', 'ColorConstants', function($scope, $rootScope, $timeout, roomService, ColorConstants){
	var _init = function(){
		var _group_books_by_shelf = function(){
		}

		var _set_colors = function(data, array){
			angular.forEach(data, function(value){
				var random_int = Math.floor(Math.random()*ColorConstants.value.length);
				var json = angular.extend(value, {"color": ColorConstants.value[random_int]});
				this.push(json);
			}, array);
			return array;
		}

		roomService.get_books_grouped_by_shelves().then(function(data){
			if(angular.isUndefined($scope.book_shelves)){
				$scope.book_shelves = [];
			}
			$scope.book_shelves = [];
			angular.forEach(data, function(book_shelf){
				var books = [];
				book_shelf.books = _set_colors(book_shelf.books, books);
				this.push(book_shelf);
			}, $scope.book_shelves);
			_group_books_by_shelf();
		});


		roomService.get_articles_grouped_by_shelves().then(function(data){
			$scope.articles_grouped_by_shelves = data;
		});

		roomService.get_visited_articles().then(function(data){
			if(angular.isUndefined($scope.visited_articles)){
				$scope.visited_articles = [];
			}
			_set_colors(data, $scope.visited_articles);
		});
		
		roomService.get_visited_books().then(function(data){
			if(angular.isUndefined($scope.visited_books)){
				$scope.visited_books = [];
			}
			_set_colors(data, $scope.visited_books);
		});


	};

	_init();
}]);