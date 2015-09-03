oditApp.service('oditService', ["$http", "$q", "$rootScope", "todo_service_url", function ($http, $q, $rootScope, todo_service_url){
	
    var _user_id = function(){
        if(angular.isDefined($rootScope.reader)){
            var user_id = $rootScope.reader.id;
        }
        else{
            var user_id = $rootScope.user.id;   
        }
        return user_id;
    }

    this.update_todo_key = function(type){
        var params = {"type": type};
        return _deferred_post_request('/api/v0/set_todos', params, $q, $http, todo_service_url);
    }

    this.get_todos = function(type){
        return _deferred_request('/api/v0/get_todos?type='+type, $q, $http, todo_service_url);
    }

}]);