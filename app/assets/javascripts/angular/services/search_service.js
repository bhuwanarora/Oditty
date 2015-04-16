homeApp.service('searchService', ["$http", "$q", "$rootScope", "WebsiteUIConstants", function($http, $q, $rootScope, WebsiteUIConstants){

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

    this.raw = function(q){
    	return _deferred_request('/api/v0/search?q='+q);
    }

	
}]);