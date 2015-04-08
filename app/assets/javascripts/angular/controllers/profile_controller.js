homeApp.controller('profileController', ["$scope", "userService", '$rootScope', "WebsiteUIConstants", 'ColorConstants', '$location', 'bookService', function($scope, userService, $rootScope, WebsiteUIConstants, ColorConstants, $location, bookService){
	var _get_detailed_info = function(){
		userService.get_detailed_info().then(function(data){
			data = data[0];
			var categories = [];
			angular.forEach(data.categories_id, function(value, index){
				var url = WebsiteUIConstants.GenreAWS + data.categories_aws_key[index];
				var json = {"root_category_id": value, "root_category_name": data.categories_name[index], "url": url, "status": true};
				this.push(json);
			}, categories);

			var books = [];
			angular.forEach(data.books_id, function(value, index){
				var random_int = Math.floor(Math.random()*ColorConstants.value.length);
				var json = {"color": ColorConstants.value[random_int], "book_id": value, "title": data.books_title[index], "author_name": data.books_author_name[index], "isbn": data.books_isbn[index]};
				this.push(json);
			}, books)

			$rootScope.user = angular.extend($rootScope.user, data);
			$rootScope.user = angular.extend($rootScope.user, {"favourite_categories": categories});
			$rootScope.user = angular.extend($rootScope.user, {"influential_books": books});
		});
	}

	var _get_feed = function(){
		userService.get_feed().then(function(data){
			$rootScope.user.feed = [];
			angular.forEach(data, function(value){
				var random_int = Math.floor(Math.random() * ColorConstants.value.length);
				value.book = angular.extend(value.book, {"color": ColorConstants.value[random_int]});
				bookService.get_basic_book_details(value.book.id).then(function(data){
					value.book = angular.extend(value.book, data);
				});
				this.push(value);
			}, $rootScope.user.feed);
		});
	}
	
	var _init = function(){
		var regex = /[?&]([^=#]+)=([^&#]*)/g;
		var url_parser = regex.exec($location.absUrl());
		if(angular.isDefined(url_parser) && url_parser != null){
        	var id = url_parser[2];
		}
		else{
			var id = $rootScope.user.id;
		}
        _get_detailed_info(id);
        _get_feed(id);
	}

	_init();
}]);