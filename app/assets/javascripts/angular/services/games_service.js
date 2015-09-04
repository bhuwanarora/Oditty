homeApp.service('gamesService', ["$http", "$q", "$rootScope", "WebsiteUIConstants", function($http, $q, $rootScope, WebsiteUIConstants){

	this.get_books = function(skip){
		return _deferred_request('/api/v0/get_game_books?skip='+skip, $q, $http);
	}

	this.get_users = function(skip){
		return _deferred_request('/api/v0/get_game_users?skip='+skip, $q, $http);
	}
	
}]);