homeApp.controller('buyController', ["$scope", "$rootScope", "bookService", "sharedService", "$mdSidenav", "$timeout", function($scope, $rootScope, bookService, sharedService, $mdSidenav, $timeout){
	var _unauthenticated_user = function(){
		return ((getCookie("logged") == "") || (getCookie("logged") == null));
	}

	var _init = (function(){
		$scope.info.loading = true;
		var id = ($rootScope.active_book.id) || ($rootScope.active_book.book_id);
		if(angular.isUndefined($scope.book)){
			$scope.book = $rootScope.active_book;
		}
		$scope.book_loading = true;
		
		if(!_unauthenticated_user()){
			var borrow_users_timeout = $timeout(function(){
				bookService.get_borrow_users(id).then(function(data){
					$scope.borrow_users = data;
					$scope.book_loading = false;
					$scope.info.loading = false;
				});
			}, 100);
			$scope.$on('destroy', function(){
				$timeout.cancel(borrow_users_timeout);
			});
		}
		else{
			$scope.book_loading = false;
			$scope.info.loading = false;
		}
	}());

	$scope.notify_friends = function(){
		var unauthenticated_user = (getCookie("logged") == "") || (getCookie("logged") == null);
		if(unauthenticated_user){
			$mdSidenav('signup').toggle();
		}
		else{

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

}]);