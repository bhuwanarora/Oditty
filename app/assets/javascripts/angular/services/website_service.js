homeApp.service('websiteService', ["$http", "$q", "$rootScope", "WebsiteUIConstants", function ($http, $q, $rootScope, WebsiteUIConstants){
	
    var _user_id = function(){
        if(angular.isDefined($rootScope.reader)){
            var user_id = $rootScope.reader.id;
        }
        else{
            var user_id = $rootScope.user.id;   
        }
        return user_id;
    }

    this.get_testimonials = function(skip){
        return _deferred_request('/api/v0/get_testimonials?skip='+skip, $q, $http);
    }

    this.add_testimonial = function(data){
        return _deferred_request('/api/v0/add_testimonial?data='+data, $q, $http);   
    }

    this.save_ad = function(params){
        return _deferred_post_request('/api/v0/save_ad', params, $q, $http);
    }

    this.recover_password = function(data){
        return _deferred_request('/api/v0/recover_password?'+data, $q, $http);
    }

    this.add_video = function(id, url){
        return _deferred_request('/api/v0/add_video?id='+id+'&url='+url, $q, $http);
    }

    this.add_videos = function(id){
        return _deferred_request('/api/v0/add_videos?id='+id, $q, $http);
    }

    this.fb_books_map = function(id){
        return _deferred_request('/api/v0/fb_books_map?id='+id, $q, $http);
    }

    this.handle_facebook_books = function(params){
        // return _deferred_post_request('/api/v0/fb_books', params, $q, $http);
    }

    this.map_facebook_books = function(params){
        return _deferred_post_request('/api/v0/map_fb_book', params, $q, $http);   
    }

    this.get_user = function(){
        return _deferred_request('/api/v0/user', $q, $http);
    }

    this.logout = function(){
        return _deferred_request('/api/v0/logout', $q, $http);
    }

    this.save_user_info = function(params){
        return _deferred_post_request('/api/v0/save_info', params, $q, $http);
    }

    this.handle_facebook_user = function(params){
        return _deferred_post_request('/api/v0/fb', params, $q, $http);
    }

    this.handle_facebook_likes = function(params){
        return _deferred_post_request('/api/v0/fb_likes', params, $q, $http);
    }

    this.handle_google_user = function(params){
        return _deferred_post_request('/api/v0/google', params, $q, $http);
    }   

    this.authenticate = function(data){
        return _deferred_post_request('/api/v0/authenticate', data, $q, $http);
    }

    this.get_user_details = function(id){
        if(angular.isDefined(id)){
            return _deferred_request('/api/v0/user_details?id='+id, $q, $http);
        }
        else{
            return _deferred_request('/api/v0/user_details', $q, $http);
        }
    }

    this.get_personal_notifications = function(){
        return _deferred_request('/api/v0/personal_notifications', $q, $http);
    }

    this.set_like_info = function(params){
        return _deferred_post_request('/api/v0/set_like_info', params, $q, $http);
    }

    this.get_community_videos = function(id){
        return _deferred_request('/api/v0/get_community_videos?id='+id, $q, $http);
    }


}]);