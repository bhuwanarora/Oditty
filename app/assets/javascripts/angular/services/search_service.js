homeApp.service('searchService', ["$http", "$q", "$rootScope", "WebsiteUIConstants", "search_service_url", function($http, $q, $rootScope, WebsiteUIConstants, search_service_url){

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
    	return _deferred_request("/api/v0/search?" + params_string, $q, $http, search_service_url);
    }

    this.raw_detailed = function(q, type){
    	if(angular.isDefined(type)){
    		return _deferred_request('/api/v0/search_detailed?q='+q+'&type='+type, $q, $http, search_service_url);
    	}
    	else{
    		return _deferred_request('/api/v0/search_detailed?q='+q, $q, $http, search_service_url);
    	}	
    }

    this.get_top_searches = function(){
        return _deferred_request('/api/v0/top_searches', $q, $http, search_service_url);
    }

    this.get_top_results = function(){
        return _deferred_request('/api/v0/top_results', $q, $http, search_service_url);   
    }

}]);