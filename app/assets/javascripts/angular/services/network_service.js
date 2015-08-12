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

    this.get_followers = function(skip, id){
        var params = "";
        if(angular.isDefined(skip)){
            params = "skip="+skip;
        }
        if(angular.isDefined(id)){
            if(params != ""){
                params = params + "&";
            }                
            params = params + "id="+id;
        }
        if(params != ""){
            params = "?"+params;
        }
        return _deferred_request("/api/v0/followers", $q, $http);
    }

    this.get_users_followed = function(skip, id){
        var params = "";
        if(angular.isDefined(skip)){
            params = "skip="+skip;
        }
        if(angular.isDefined(id)){
            if(params != ""){
                params = params + "&";
            }                
            params = params + "id="+id;
        }
        if(params != ""){
            params = "?"+params;
        }
        return _deferred_request("/api/v0/users_followed", $q, $http);
    }

    this.search_friends = function(q){
        return _deferred_request('/api/v0/search_friends?q='+q, $q, $http);
    }

}]);