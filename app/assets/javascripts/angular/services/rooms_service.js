homeApp.service('roomsService', ["$http", "$q", "$rootScope", "WebsiteUIConstants", function($http, $q, $rootScope, WebsiteUIConstants){

	this.get_rooms = function(skip){
		return _deferred_request('/api/v0/get_rooms?skip='+skip, $q, $http);
	}
	
}]);