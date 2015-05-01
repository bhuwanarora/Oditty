homeApp.service('communityService', ["$http", "$q", "$rootScope", "WebsiteUIConstants", function($http, $q, $rootScope, WebsiteUIConstants){

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


	this.get_news_info = function(id){
		return _deferred_request('/api/v0/news_info?id='+id);
	}

    this.get_chronological_news = function(id){
        return _deferred_request('/api/v0/chronological_news?id='+id);
    }

    this.get_community_details = function(id){
        return _deferred_request('/api/v0/basic_community_info?id='+id);
    }

    this.get_metadata = function(url){
        return _deferred_request('/api/v0/metadata?url='+url);
    }

    this.get_detailed_community_info = function(id){
        return _deferred_request('/api/v0/detailed_community_info?id='+id);
    }

    this.follow = function(id, status){
        return _deferred_request('/api/v0/follow_community?id='+id+"&status="+status);
    }
}]);