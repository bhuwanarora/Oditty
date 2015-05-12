homeApp.service('infinityService', ["$http", "$q", "$rootScope", "WebsiteUIConstants", function ($http, $q, $rootScope, WebsiteUIConstants){
	
    var _user_id = function(){
        if(angular.isDefined($rootScope.reader)){
            var user_id = $rootScope.reader.id;
        }
        else{
            var user_id = $rootScope.user.id;   
        }
        return user_id;
    }

    this.get_books = function(skip_count){
        filters = angular.extend($rootScope.filters, {"skip_count": skip_count});
        var filters = angular.toJson(filters);
        return _deferred_request('/api/v0/get_filtered_books?q='+filters, $q, $http);
    }

    this.get_small_reads = function(){
        return _deferred_request('/api/v0/small_reads', $q, $http);
    }

    this.get_books_from_favourite_author = function(){
        return _deferred_request('/api/v0/books_from_favourite_author', $q, $http);
    }

    this.get_books_from_favourite_category = function(){
        return _deferred_request('/api/v0/books_from_favourite_category', $q, $http);
    }

    this.get_books_from_favourite_era = function(){
        return _deferred_request('/api/v0/books_from_favourite_era', $q, $http);
    }

    this.get_books_on_friends_shelves = function(){
        return _deferred_request('/api/v0/books_on_friends_shelves', $q, $http);
    }

    this.get_books_from_unexplored_subjects = function(){
        return _deferred_request('/api/v0/books_from_unexplored_subjects', $q, $http);
    }

}]);