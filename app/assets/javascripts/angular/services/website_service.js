websiteApp.service('websiteService', function ($http, $q, $rootScope) {
	
    this.get_book_details = function(filter){
        return _deferred_request('/api/v0/book?'+filter);
    }

    this.authenticate = function(data){
        return _deferred_post_request('/api/v0/authenticate', data);
    }

    this.update_profile = function(data){
        return _deferred_post_request('/api/v0/profile', data);
    }
    
    this.get_user_details = function(filter){
        //filter user_id=USER_ID
        return _deferred_request('/api/v0/user_details?'+filter);
    }

    this.get_background_image = function(){
        return _deferred_request('/api/v0/image');
    }

    this.get_notifications = function(data){
        return _deferred_request('/api/v0/notifications?id='+data.id);
    }

    this.search = function(filter, type, count){
        return _deferred_request('/api/v0/search?count='+count+'&q='+filter+'&t='+type);
    }

    _deferred_request = function(url){
        var deferred = $q.defer();
        $http.get(url).then(function(result) {
            return deferred.resolve(result.data); 
        });
        return deferred.promise;   
    }

    _deferred_post_request = function(url, params){
        var deferred = $q.defer();
        $http.post(url, params).then(function(result){
            return deferred.resolve(result.data); 
        });
        return deferred.promise;
    }

});