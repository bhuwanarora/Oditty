homeApp.service('authorService', ["$http", "$q", "$rootScope", "WebsiteUIConstants", "base_url", "search_service_url", function ($http, $q, $rootScope, WebsiteUIConstants, base_url, search_service_url){
	
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
        return _deferred_request('/api/v0/search?q='+data+"&type=Author", $q, $http, search_service_url);
    }

    this.get_popular_authors = function(skip_count){
        return _deferred_request('/api/v0/popular_authors?skip_count='+skip_count, $q, $http, search_service_url);
    }

    this.get_details = function(id, skip){
        return _deferred_request('/api/v0/author_details?id='+id+'&skip='+skip, $q, $http);
    }

    this.follow = function(id, status){
        return _deferred_request('/api/v0/follow_author?id='+id+'&status='+status, $q, $http);
    }

    this.get_interview_details = function(id){
        return _deferred_request('/api/v0/author_interview?id='+id, $q, $http);
    }

    this.get_basic_info = function(id){
        return _deferred_request('/api/v0/author_basic_info?id='+id, $q, $http);
    }

    this.get_authors_interviewed = function(skip){
        return _deferred_request('/api/v0/get_authors_interviewed?skip='+skip, $q, $http);
    }

}]);