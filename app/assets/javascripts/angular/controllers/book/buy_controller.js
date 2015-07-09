homeApp.controller('buyController', ["$scope", "$rootScope", "bookService", "sharedService", "$mdSidenav", "$timeout", "$sce", function($scope, $rootScope, bookService, sharedService, $mdSidenav, $timeout, $sce){
	var _unauthenticated_user = function(){
		return ((getCookie("logged") == "") || (getCookie("logged") == null));
	}

	$scope.notify_friends = function(){
		var unauthenticated_user = (getCookie("logged") == "") || (getCookie("logged") == null);
		if(unauthenticated_user){
			$mdSidenav('signup').toggle();
		}
		else{
			var id = ($rootScope.active_book.id) || ($rootScope.active_book.book_id);
			if(!$scope.info.loading){
				$scope.info.loading = true;
				bookService.send_borrow_notification(id).then(function(){
					$scope.info.loading = false;
					$scope.hide_link = true;
				});
			}
		}
	}

	$scope.toggle_bookmark = function(status){
		if(_unauthenticated_user()){
			$mdSidenav('signup').toggle();
		}
		else{
			var id = ($rootScope.active_book.id) || ($rootScope.active_book.book_id);
			var label = {"label_key": "IOwnThis"};
			var bookmark_object = {"type": "Book", "id": id};
			sharedService.toggle_bookmark(label, status, bookmark_object);
		}
	}

	$scope.get_prices_and_reviews = function(data){
		if(angular.isDefined($scope.prices)){
			$scope.prices = $scope.prices.concat(data.prices);
		}
		else{
			$scope.prices = data.prices;
		}
		if(angular.isDefined($scope.reviews)){
			// $scope.reviews = $scope.reviews.concat(data.reviews);
		}
		else{
			$scope.reviews = data.reviews;
			$scope.reviews.user_review_iframe = $sce.trustAsResourceUrl($scope.reviews.user_review_iframe);
		}
	}

	var _init = (function(){
		var id = ($rootScope.active_book.id) || ($rootScope.active_book.book_id);
		var isbn = $rootScope.active_book.isbn;
		
		if(angular.isUndefined($scope.book)){
			$scope.book = $rootScope.active_book;
		}
		
		if(!_unauthenticated_user()){
			var borrow_users_timeout = $timeout(function(){
				bookService.get_borrow_users(id).then(function(data){
					$scope.borrow_users = data;
				});
			}, 100);
			$scope.$on('destroy', function(){
				$timeout.cancel(borrow_users_timeout);
			});
		}
		
		var all_prices_timeout = $timeout(function(){
			bookService.all_prices(isbn).then(function(data){
				$scope.get_prices_and_reviews(data);
			});
		}, 100);
		var more_prices_timeout = $timeout(function(){
			$scope.loading_buy_options = true;
			bookService.more_prices(isbn).then(function(data){
				$scope.get_prices_and_reviews(data);
				$scope.loading_buy_options = false;
			});
		}, 100);
		$scope.$on('destroy', function(){
			$timeout.cancel(all_prices_timeout);
			$timeout.cancel(more_prices_timeout);
		});
	}());

}]);