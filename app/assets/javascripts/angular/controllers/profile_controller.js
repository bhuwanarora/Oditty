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
		var _get_message = function(value){
			var message = ""
			switch(value.label){
				case "BookmarkNode":
					message = "Added to "+value.node.key;
					break;
				case "Listopia":
					break;
				case "CommunityNode":
					break;
				case "BlogNode":
					break;
				case "StatusNode":
					message = value.node.wrapper_content;
					break;
				case "EndorseNode":
					message = "Endorsed this book.";
					break;
			}
			return message;
		}

		var _group_feed = function(){
			var grouped_feed = [];
			var _book_exists = function(grouped_feed, book_id){
				var book_exists = false;
				var feed_index = 0;
				if(grouped_feed.length > 0){
					angular.forEach(grouped_feed, function(value, index){
						if(angular.isDefined(value.book)){
							if(value.book.id == book_id){
								book_exists = true;
								feed_index = index
							}
						}
					});
				}
				return {"status": book_exists, "index": feed_index};
			}

			angular.forEach($rootScope.user.feed, function(value){
				if(angular.isDefined(value.book)){
					var book = _book_exists(grouped_feed, value.book.id);
					if(book.status){
						delete value.book;
						grouped_feed[book.index].data.push(value)
					}
					else{
						if(angular.isDefined(value.book)){
							book = {"book": value.book};
							delete value.book;
							value = angular.extend(book, {"data": [value]});
						}
						this.push(value);
					}
				}
				else{
					this.push(value);
				}
			}, grouped_feed);
			$rootScope.user.feed = grouped_feed;
		}

		userService.get_feed().then(function(data){
			$rootScope.user.feed = [];
			angular.forEach(data, function(value){
				var random_int = Math.floor(Math.random() * ColorConstants.value.length);
				if(angular.isDefined(value.book)){
					value.book = angular.extend(value.book, {"color": ColorConstants.value[random_int]});
				}
				this.push(value);
			}, $rootScope.user.feed);
			_group_feed();
			angular.forEach($rootScope.user.feed, function(value){
				if(angular.isDefined(value.book)){
					bookService.get_basic_book_details(value.book.id).then(function(data){
						value.book = angular.extend(value.book, data);
						angular.forEach(value.data, function(feed_data){
							var message = _get_message(feed_data);
							feed_data = angular.extend(feed_data, {"message": message});
						})
					});
				}
				else{
					var message = _get_message(value);
					var feed_data = angular.extend(value, {"message": message});
					value.data = [feed_data];
				}
			});
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