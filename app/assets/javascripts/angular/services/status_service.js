homeApp.service('statusService', ["$http", "$q", "$rootScope", "WebsiteUIConstants", function ($http, $q, $rootScope, WebsiteUIConstants){
	
    var _user_id = function(){
        if(angular.isDefined($rootScope.reader)){
            var user_id = $rootScope.reader.id;
        }
        else{
            var user_id = $rootScope.user.id;   
        }
        return user_id;
    }

    this.post_status = function(params){
        var params = angular.toJson(params);
        return _deferred_post_request('/api/v0/create_status', params, $q, $http);
    }

}]);