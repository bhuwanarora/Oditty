homeApp.service('bookService', ["$http", "$q", "$rootScope", "WebsiteUIConstants", function ($http, $q, $rootScope, WebsiteUIConstants){
	
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

    this.get_basic_book_details = function(id){
        return _deferred_request('/api/v0/basic_book?id='+id);
    }

    this.handle_facebook_books = function(params){
        return _deferred_post_request('/api/v0/fb_books', params);
    }

    this.get_book_details = function(filter){
        return _deferred_request('/api/v0/book?'+filter);
    }

    this.handle_influential_books = function(id, status){
        return _deferred_request('/api/v0/influential_books?id='+id+"&status="+status);
    }

    this.get_books_bookmarked = function(skip_count){
        return _deferred_request('/api/v0/books_bookmarked?skip_count='+skip_count+'&id='+_user_id());
    }

    this.get_books_read = function(skip_count){
        return _deferred_request('/api/v0/books_read?skip_count='+skip_count+'&id='+_user_id());
    }

    this.search_books = function(data, skip_count){
        return _deferred_request('/api/v0/search_books?q='+data+"&skip="+skip_count);
    }

    this.get_popular_books = function(params){
        return _deferred_request('/api/v0/popular_books?q='+params);
    }

    this.books_on_signup = function(params){
        return _deferred_request('/api/v0/books_on_signup?q='+params);
    }

    this.endorse_book = function(id, status){
        return _deferred_request('/api/v0/endorse_book?id='+id+'&status='+status);
    }

    this.update_visited = function(id){
        return _deferred_request('/api/v0/update_visited?id='+id);
    }

    this.get_feed = function(id, skip_count){
        return _deferred_request('/api/v0/book_feed?id='+id+"&skip_count="+skip_count);
    }

    this.rate_book = function(id, data){
        return _deferred_request('/api/v0/rate?id='+id+"&data="+data);
    }

}]);