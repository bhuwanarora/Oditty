homeApp.service('publishersService', ["$http", "$q", "$rootScope", "WebsiteUIConstants", function($http, $q, $rootScope, WebsiteUIConstants){

    this.get_info = function(id){
        return _deferred_request('/api/v0/publishers_info?id='+id, $q, $http);
    }

    this.get_books = function(id){
    	return _deferred_request('/api/v0/publishers_books?id='+id, $q, $http);	
    }

}]);