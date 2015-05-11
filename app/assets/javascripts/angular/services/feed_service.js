homeApp.service('feedService', ["$http", "$q", "$rootScope", "WebsiteUIConstants", function ($http, $q, $rootScope, WebsiteUIConstants){
	
    var _user_id = function(){
        if(angular.isDefined($rootScope.reader)){
            var user_id = $rootScope.reader.id;
        }
        else{
            var user_id = $rootScope.user.id;   
        }
        return user_id;
    }

    this.get_feed = function(skip_count){
        return _deferred_request('/api/v0/feed?skip_count='+skip_count, $q, $http);
    }

    this.get_notifications = function(){
        return _deferred_request('/api/v0/personal_notifications', $q, $http);
    }

}]);