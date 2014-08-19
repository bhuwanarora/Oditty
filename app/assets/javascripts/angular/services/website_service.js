websiteApp.service('websiteService', ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {
	
    this.get_user = function(){
        return _deferred_request('/api/v0/user');
    }

    this.get_followed_by = function(){
        return _deferred_request('/api/v0/followed_by');
    }

    this.save_feedback = function(params){
        return _deferred_post_request('/api/v0/save_feedback', params);
    }

    this.save_user_info = function(params){
        return _deferred_post_request('/api/v0/save_info', params);
    }

    this.handle_facebook_user = function(params){
        return _deferred_post_request('/api/v0/fb', params);
    }

    this.handle_google_user = function(params){
        return _deferred_post_request('/api/v0/google', params);
    }

    this.get_book_details = function(filter){
        return _deferred_request('/api/v0/book?'+filter);
    }

    this.get_books_bookmarked = function(skip_count){
        return _deferred_request('/api/v0/books_bookmarked?skip_count='+skip_count);
    }

    this.get_books_read = function(skip_count){
        return _deferred_request('/api/v0/books_read?skip_count='+skip_count);
    }

    this.search_books = function(data){
        return _deferred_request('/api/v0/search_books?q='+data);
    }

    this.search_authors = function(data){
        return _deferred_request('/api/v0/search_authors?q='+data);
    }

    this.search_genres = function(data){
        return _deferred_request('/api/v0/search_genres?'+data);
    }

    this.get_trending_topics = function(){
        return _deferred_request('/api/v0/trends');
    }

    this.authenticate = function(data){
        return _deferred_post_request('/api/v0/authenticate', data);
    }

    this.update_profile = function(data){
        return _deferred_post_request('/api/v0/profile', data);
    }
    
    this.get_user_details = function(){
        return _deferred_request('/api/v0/user_details');
    }

    this.get_genres = function(){
        return _deferred_request('/api/v0/genres');
    }

    this.get_background_image = function(){
        return _deferred_request('/api/v0/image');
    }

    this.get_notifications = function(skip_count){
        return _deferred_request('/api/v0/notifications?skip_count='+skip_count);
    }

    this.get_latest_notification = function(){
        return _deferred_request('/api/v0/latest_notification');
    }

    this.search = function(filter, type, count){
        return _deferred_request('/api/v0/search?count='+count+'&q='+filter+'&t='+type);
    }

    this.get_info_data = function(){
        return _deferred_request('/api/v0/info_data');
    }

    this.get_popular_books = function(skip_count){
        return _deferred_request('/api/v0/popular_books?skip_count='+skip_count);   
    }

    this.get_popular_authors = function(skip_count){
        return _deferred_request('/api/v0/popular_authors?skip_count='+skip_count);   
    }

    _deferred_request = function(url){
        var deferred = $q.defer();
        var success_callback = function(result){
            return deferred.resolve(result.data); 
        }
        var error_callback = function(reason){
            if(reason.status == 500){
                alert("internal server error");
            }
        }
        $http.get(url).then(success_callback, error_callback);
        return deferred.promise;   
    }

    _deferred_post_request = function(url, params){
        var deferred = $q.defer();
        var success_callback = function(result){
            return deferred.resolve(result.data); 
        }
        var error_callback = function(reason){
            if(reason.status == 500){
                alert("internal server error");
            }
            else if(reason.status == 403){
                return deferred.reject(reason);
            }
        }
        $http.post(url, params).then(success_callback, error_callback);
        return deferred.promise;
    }

}]);