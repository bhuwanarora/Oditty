homeApp.service('roomService', ["$http", "$q", "$rootScope", "WebsiteUIConstants", function($http, $q, $rootScope, WebsiteUIConstants){

	 var _deferred_request = function(url){
        var deferred = $q.defer();
        var successCallback = function(result) {
            return deferred.resolve(result.data); 
        }
        var errorCallback = function(reason){
            $rootScope.user.loading = false;
            if(reason.status == 500){
                alert(WebsiteUIConstants.ServerError);
            }
        }

        $http.get(url).then(successCallback, errorCallback);
        return deferred.promise;
    }


	this.get_books_grouped_by_shelves = function(){
		return _deferred_request('/api/v0/get_visited_books');
	}

	this.get_articles_grouped_by_shelves = function(){
		return _deferred_request('/api/v0/get_visited_books');
	}

	this.get_visited_articles = function(){
		return _deferred_request('/api/v0/get_visited_books');
	}

	this.get_visited_books = function(){
		return _deferred_request('/api/v0/get_visited_books');
	}
}]);