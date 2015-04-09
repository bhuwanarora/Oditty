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

	this.get_all_shelves = function(){
		return _deferred_request('/api/v0/labels');
	};

	this.add_new_label = function(label){
		return _deferred_request('/api/v0/add_new_label?label='+label);
	};

    this.bookmark = function(params){
        params = angular.toJson(params);
        return _deferred_request('/api/v0/bookmark?q='+params);
    }

}]);