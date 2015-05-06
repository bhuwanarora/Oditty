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

    this.raw = function(params){
    	var q = params.q;
        var type = params.type;
        var skip = params.skip;
        var count = params.count;
        params_string = "q="+q;
        if(angular.isDefined(type)){
            params_string = params_string + "&type=" + type;
        }
        if(skip){
            params_string = params_string + "&skip=" + skip;
        }
        if(count){
            params_string = params_string + "&count=" + count;
        }
    	return _deferred_request("/api/v0/search?" + params_string);
    }

    this.raw_detailed = function(q, type){
    	if(angular.isDefined(type)){
    		return _deferred_request('/api/v0/search_detailed?q='+q+'&type='+type);
    	}
    	else{
    		return _deferred_request('/api/v0/search_detailed?q='+q);
    	}	
    }

	
}]);