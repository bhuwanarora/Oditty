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

    var _deferred_request = function(url){
        var deferred = $q.defer();
        var success_callback = function(result){
            return deferred.resolve(result.data); 
        }
        var error_callback = function(reason){
            if(reason.status == 500){
                alert(WebsiteUIConstants.ServerError);
            }
        }
        $http.get(url).then(success_callback, error_callback);
        return deferred.promise;   
    }

    var _deferred_post_request = function(url, params){
        var deferred = $q.defer();
        var success_callback = function(result){
            return deferred.resolve(result.data); 
        }
        var error_callback = function(reason){
            console.debug("error_callback service", reason);
            if(reason.status == 500){
                alert(WebsiteUIConstants.ServerError);
            }
            else if(reason.status == 403){
                console.debug("403 authenticate");
                return deferred.reject(reason);
            }
        }
        $http.post(url, params).then(success_callback, error_callback);
        return deferred.promise;
    }

    this.get_books = function(skip_count){
        filters = angular.extend($rootScope.filters, {"skip_count": skip_count});
        var filters = angular.toJson(filters);
        return _deferred_request('/api/v0/get_filtered_books?q='+filters);
    }

    this.get_small_reads = function(){
        return _deferred_request('/api/v0/small_reads');
    }

    this.get_books_from_favourite_author = function(){
        return _deferred_request('/api/v0/books_from_favourite_author');
    }

    this.get_books_from_favourite_category = function(){
        return _deferred_request('/api/v0/books_from_favourite_category');
    }

    this.get_books_from_favourite_era = function(){
        return _deferred_request('/api/v0/books_from_favourite_era');
    }

    this.get_books_on_friends_shelves = function(){
        return _deferred_request('/api/v0/books_on_friends_shelves');
    }

    this.get_books_from_unexplored_subjects = function(){
        return _deferred_request('/api/v0/books_from_unexplored_subjects');
    }

}]);