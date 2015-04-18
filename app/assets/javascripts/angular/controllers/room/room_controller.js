homeApp.controller('roomController', ["$scope", "$rootScope", "$timeout", 'roomService', 'ColorConstants', function($scope, $rootScope, $timeout, roomService, ColorConstants){
	$scope.add_books_to_shelf = function(shelf, event){
		$scope.info.show_book_share = true;
	}

	var _get_books_grouped_by_shelves = function(){
		roomService.get_books_grouped_by_shelves().then(function(data){
			if(angular.isUndefined($scope.book_shelves)){
				$scope.book_shelves = [];
			}
			$scope.book_shelves = [];
			angular.forEach(data, function(book_shelf){
				var books = [];
				book_shelf.books = _set_data(book_shelf.books, books);
				this.push(book_shelf);
			}, $scope.book_shelves);
			_group_books_by_shelf();
		});
	}

	var _get_articles_grouped_by_shelves = function(){
		roomService.get_articles_grouped_by_shelves().then(function(data){
			$scope.articles_grouped_by_shelves = data;
		});
	}

	var _get_visited_articles = function(){
		roomService.get_visited_articles().then(function(data){
			if(angular.isUndefined($scope.visited_articles)){
				$scope.visited_articles = [];
			}
			_set_data(data, $scope.visited_articles);
		});
	}

	var _get_visited_books = function(){
		roomService.get_visited_books().then(function(data){
			if(angular.isUndefined($scope.visited_books)){
				$scope.visited_books = [];
			}
			_set_data(data, $scope.visited_books);
		});
	}

	var _get_random_init = function(min, max){
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	var _set_data = function(data, array){
		angular.forEach(data, function(value){
			var random_int = Math.floor(Math.random()*ColorConstants.value.length);
			var width = _get_random_init(70, 100);
			var height = _get_random_init(40, 60);
			var random_style = {"width": width+"%", "height": height+"px", "background-color": ColorConstants.value[random_int]};
			var json = angular.extend(value, {"random_style": random_style, "color": ColorConstants.value[random_int]});
			this.push(json);
		}, array);
		return array;
	}

	var _group_books_by_shelf = function(){
		var _shelf_exists = function(shelf, groups){
			var shelf_exists = false;
			var shelf_index = 0;
			angular.forEach(groups, function(book_shelf, index){
				if(shelf == book_shelf.shelf){
					shelf_exists = true;
					shelf_index = index;
				}
			});
			return {"status": shelf_exists, "index": shelf_index};
		}

		var groups = [];
		angular.forEach($scope.book_shelves, function(value){
			var shelf_exists = _shelf_exists(value.shelf, groups);
			if(shelf_exists.status){
				groups[shelf_exists.index].books.push(value.books[0]);
			}
			else{
				groups.push(value);
			}
		});
		$scope.book_shelves = groups;
	}

	var _init = (function(){
		_get_books_grouped_by_shelves();
		_get_articles_grouped_by_shelves();
		_get_visited_articles();
		_get_visited_books();
	}());

}]);