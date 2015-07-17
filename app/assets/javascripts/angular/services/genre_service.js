homeApp.service('genreService', ["$http", "$q", "$rootScope", "WebsiteUIConstants", "search_service_url", function ($http, $q, $rootScope, WebsiteUIConstants){
	
    var _user_id = function(){
        if(angular.isDefined($rootScope.reader)){
            var user_id = $rootScope.reader.id;
        }
        else{
            var user_id = $rootScope.user.id;   
        }
        return user_id;
    }

    this.search_genres = function(q){
        return _deferred_request('/api/v0/search?q='+q+"&type=Genre", $q, $http);
    }

    this.search_star_genres = function(q){
        return _deferred_request('/api/v0/search_star_genre?q='+q, $q, $http);
    }

    this.get_genres = function(){
        return _deferred_request('/api/v0/genres', $q, $http);
    }

    this.get_categories = function(){
        return _deferred_request('/api/v0/categories', $q, $http);   
    }

    this.get_basic_details = function(id){
        return _deferred_request('/api/v0/genre_details?id='+id, $q, $http);
    }

}]);