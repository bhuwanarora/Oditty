homeApp.service('networkService', ["$http", "$q", "$rootScope", "WebsiteUIConstants", function ($http, $q, $rootScope, WebsiteUIConstants){
	
    var _user_id = function(){
        if(angular.isDefined($rootScope.reader)){
            var user_id = $rootScope.reader.id;
        }
        else{
            var user_id = $rootScope.user.id;   
        }
        return user_id;
    }

    this.get_followers = function(skip){
        if(angular.isDefined(skip)){
            return _deferred_request('/api/v0/followers?skip='+skip, $q, $http);
        }
        else{
            return _deferred_request('/api/v0/followers', $q, $http);
        }
    }

    this.get_users_followed = function(skip){
        if(angular.isDefined(skip)){
            return _deferred_request('/api/v0/users_followed?skip='+skip, $q, $http);    
        }
        else{
            return _deferred_request('/api/v0/users_followed', $q, $http);
        }
    }

    this.search_friends = function(q){
        return _deferred_request('/api/v0/search_friends?q='+q, $q, $http);
    }

}]);