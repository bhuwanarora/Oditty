homeApp.service('authorService', ["$http", "$q", "$rootScope", "WebsiteUIConstants", function ($http, $q, $rootScope, WebsiteUIConstants){
	
    var _user_id = function(){
        if(angular.isDefined($rootScope.reader)){
            var user_id = $rootScope.reader.id;
        }
        else{
            var user_id = $rootScope.user.id;   
        }
        return user_id;
    }

    this.search_authors = function(data){
        return _deferred_request('/api/v0/search?q='+data+"&type=Author", $q, $http);
    }

    this.get_popular_authors = function(skip_count){
        return _deferred_request('/api/v0/popular_authors?skip_count='+skip_count, $q, $http);
    }

    this.get_details = function(id){
        return _deferred_request('/api/v0/author_details?id='+id, $q, $http);
    }

    this.follow = function(id, status){
        return _deferred_request('/api/v0/follow_author?id='+id+'&status='+status, $q, $http);
    }

}]);