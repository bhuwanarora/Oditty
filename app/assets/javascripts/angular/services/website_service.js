app.service('websiteService', ["$http", "$q", "$rootScope", "WebsiteUIConstants", function ($http, $q, $rootScope, WebsiteUIConstants){
	
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

    this.recover_password = function(data){
        return _deferred_request('/api/v0/recover_password?'+data);
    }

    this.fb_books_map = function(id){
        return _deferred_request('/api/v0/fb_books_map?id='+id);   
    }

    this.handle_facebook_books = function(params){
        return _deferred_post_request('/api/v0/fb_books', params);
    }

    this.get_user = function(){
        return _deferred_request('/api/v0/user');
    }

    this.logout = function(){
        return _deferred_request('/api/v0/logout');
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

    this.authenticate = function(data){
        return _deferred_post_request('/api/v0/authenticate', data);
    }

    this.get_user_details = function(id){
        if(angular.isDefined(id)){
            return _deferred_request('/api/v0/user_details?id='+id);
        }
        else{
            return _deferred_request('/api/v0/user_details');
        }
    }

    this.get_personal_notifications = function(){
        return _deferred_request('/api/v0/personal_notifications');
    }

}]);