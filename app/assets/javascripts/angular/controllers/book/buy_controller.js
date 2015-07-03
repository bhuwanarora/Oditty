homeApp.controller('buyController', ["$scope", "$rootScope", "bookService", "sharedService", "$mdSidenav", "$timeout", function($scope, $rootScope, bookService, sharedService, $mdSidenav, $timeout){
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
		// var data = {
		// 	"prices": [
		// 		{
		// 			store: "Amazon.in",
		// 			price: 1058.40,
		// 			currency_code: "INR",
		// 			delivery_info: "Usually dispatched within 1-3 weeks",
		// 			min_days: 11,
		// 			max_days: 15,
		// 			url: "http://www.amazon.in/Tiger-Woods-How-Play-Golf/dp/0446529311%3FSubscriptionId%3DAKIAJUPAVELJRPUOFMLA%26tag%3Dreade03-21%26linkCode%3Dxm2%26camp%3D2025%26creative%3D165953%26creativeASIN%3D0446529311",
		// 			in_stock: true,
		// 			max_price: asas,
		// 		},
		// 		{
		// 			store: "Amazon.in",
		// 			price: 1058.40,
		// 			currency_code: "INR",
		// 			delivery_info: "Usually dispatched within 1-3 weeks",
		// 			min_days: 11,
		// 			max_days: 15,
		// 			url: "http://www.amazon.in/Tiger-Woods-How-Play-Golf/dp/0446529311%3FSubscriptionId%3DAKIAJUPAVELJRPUOFMLA%26tag%3Dreade03-21%26linkCode%3Dxm2%26camp%3D2025%26creative%3D165953%26creativeASIN%3D0446529311",
		// 			in_stock: true
		// 		}
		// 	],
		// 	"reviews":{
		// 		user_review_iframe: "http://www.amazon.com/reviews/iframe?akid=AKIAJUPAVELJRPUOFMLA&alinkCode=xm2&asin=0446529311&atag=reade06c-20&exp=2015-07-03T12%3A44%3A03Z&v=2&sig=QenSpwxuPF8HuOYmZ%2Fa1QDERUcE45N9ZXY%2FgTf0U3S0%3D",
		// 		editorial_review: "No athlete has changed his sport the way Tiger Woods has transformed the world of golf. The Tiger phenomenon has created a new legion of golfers, seduced by Woods's almost effortless mastery of this most difficult game. In <I>How I Play Golf</I> Woods reveals the many facets of his game and offers a plethora of tips and advice aimed at all levels of play. Unlike most golf guides, and perhaps somewhat surprising from a player best known for his long game, <I>How I Play Golf</I> begins with the short game--putting, chipping, and pitching--before moving onto swing mechanics and hitting off the tee. Produced in conjunction with the editors of <I>Golf Digest</I>, the book is lavishly photographed and illustrated and offers a gold mine of useful ideas and mental images Tiger has collected over the years. Throughout, Tiger recounts memorable shots from his relatively brief career; for example, his only perfect shot (a 3-wood on No. 14 at St. Andrews) and his first putt at the 1995 Masters (a 20-footer for birdie on No. 1 that missed and rolled off the green). <I>How I Play Golf</I> is not only a first-rate instructional guide, it also communicates a passion and respect for the game that beginners, hackers, and low handicappers should find inspiring. Highly recommended. <I>--Harry C. Edwards</I>",
		// 		source: "Amazon.com"
		// 	}
		// }
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
			bookService.more_prices(isbn).then(function(data){
				$scope.get_prices_and_reviews(data)
			});
		}, 100);
		$scope.$on('destroy', function(){
			$timeout.cancel(all_prices_timeout);
			$timeout.cancel(more_prices_timeout);
		});
	}());

}]);