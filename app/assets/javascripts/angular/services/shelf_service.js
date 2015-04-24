homeApp.service('shelfService', ["$http", "$q", "$rootScope", "WebsiteUIConstants", function($http, $q, $rootScope, WebsiteUIConstants){

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
    };

    var _deferred_post_request = function(url, params){
        var deferred = $q.defer();
        var success_callback = function(result){
            return deferred.resolve(result.data); 
        }
        var error_callback = function(reason){
            console.debug("error_callback service", reason);
            if(reason.status == 500){
                alert(WebsiteUIConstants.ServerError);
            }
            else if(reason.status == 403){
                console.debug("403 authenticate");
                return deferred.reject(reason);
            }
        }
        $http.post(url, params).then(success_callback, error_callback);
        return deferred.promise;
    }

	this.get_all_shelves = function(){
		return _deferred_request('/api/v0/labels');
	};

	this.add_new_label = function(label){
		return _deferred_request('/api/v0/add_new_label?label='+label);
	};

    this.bookmark = function(params){
        return _deferred_post_request('/api/v0/bookmark', params);
    }

}]);