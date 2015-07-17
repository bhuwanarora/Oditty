homeApp.service('userService', ["$http", "$q", "$rootScope", "WebsiteUIConstants", function ($http, $q, $rootScope, WebsiteUIConstants){
	
    var _user_id = function(){
        if(angular.isDefined($rootScope.reader)){
            var user_id = $rootScope.reader.id;
        }
        else{
            var user_id = $rootScope.user.id;   
        }
        return user_id;
    }

    this.recover_password = function(data){
        return _deferred_request('/api/v0/recover_password?'+data, $q, $http);
    }

    this.get_user = function(){
        return _deferred_request('/api/v0/user', $q, $http);
    }

    this.get_detailed_info = function(id){
        if(angular.isDefined(id)){
            return _deferred_request('/api/v0/user_profile_info?id='+id, $q, $http);
        }
        else{
            return _deferred_request('/api/v0/user_profile_info', $q, $http);
        }
    }

    this.logout = function(){
        return _deferred_request('/api/v0/logout', $q, $http);
    }

    this.get_followed_by = function(){
        return _deferred_request('/api/v0/followed_by', $q, $http);
    }

    this.save_feedback = function(params){
        return _deferred_post_request('/api/v0/save_feedback', params, $q, $http);
    }

    this.save_user_info = function(params){
        return _deferred_post_request('/api/v0/save_info', params, $q, $http);
    }

    this.handle_facebook_user = function(params){
        return _deferred_post_request('/api/v0/fb', params, $q, $http);
    }

    this.handle_google_user = function(params){
        return _deferred_post_request('/api/v0/google', params, $q, $http);
    }

    this.authenticate = function(data){
        return _deferred_post_request('/api/v0/authenticate', data, $q, $http);
    }

    this.update_profile = function(data){
        return _deferred_post_request('/api/v0/profile', data, $q, $http);
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

    this.get_notifications = function(skip_count, user_id, debug_feed){
        if(angular.isDefined(user_id)){
            if(angular.isDefined(debug_feed)){
                return _deferred_request('/api/v0/notifications?skip_count='+skip_count+"&id="+user_id+"&debug="+true, $q, $http);
            }
            else{
                return _deferred_request('/api/v0/notifications?skip_count='+skip_count+"&id="+user_id, $q, $http);
            }
        }
        else{
            return _deferred_request('/api/v0/notifications?skip_count='+skip_count, $q, $http);
        }
    }

    this.get_influential_books = function(){
        return _deferred_request('/api/v0/get_influential_books', $q, $http);
    }

    this.get_latest_notification = function(){
        return _deferred_request('/api/v0/latest_notification', $q, $http);
    }

    this.get_info_data = function(){
        return _deferred_request('/api/v0/info_data', $q, $http);
    }

    this.get_personal_feed = function(id, skip){
        skip = skip || 0;
        if(angular.isDefined(id)){
            return _deferred_request('/api/v0/notifications?id='+id+'&skip='+skip, $q, $http);
        }
        else{
            return _deferred_request('/api/v0/notifications?skip='+skip, $q, $http);
        } 
    }

    this.get_feed = function(id){
        if(angular.isDefined(id)){
            return _deferred_request('/api/v0/feed_news?id='+id, $q, $http);
        }
        else{
            return _deferred_request('/api/v0/feed_news', $q, $http);
        }
    }

    this.follow = function(id, status){
        return _deferred_request('/api/v0/follow?id='+id+"&status="+status, $q, $http);
    }

    this.get_blog_feed = function(skip_count, multiple){
        skip_count = skip_count || 0;
        multiple = multiple || false;
        return _deferred_request('/api/v0/feed_blog?skip_count='+skip_count+'&multiple='+multiple, $q, $http);
    }

    this.get_last_blog = function(){
        return _deferred_request('/api/v0/last_blog', $q, $http);
    }

    this.get_regions = function(){
        return _deferred_request('/api/v0/regions', $q, $http);
    }

    
    this.suggest_communities = function(){
        return _deferred_request('/api/v0/suggest_communities', $q, $http);
    }

    this.recommend = function(friends_id, book_id){
        return _deferred_request('/api/v0/recommend?friends_id='+friends_id+'&book_id='+book_id, $q, $http);
    }

    this.get_communities = function(id){
        if(angular.isDefined(id)){
            return _deferred_request('/api/v0/get_communities?id='+id, $q, $http);
        }
        else{
            return _deferred_request('/api/v0/get_communities', $q, $http);
            
        }
    }

    
    this.get_social_books = function(){
        return _deferred_request('/api/v0/social_books', $q, $http);
    }

    this.get_facebook_likes = function(){
        return _deferred_request('/api/v0/get_likes', $q, $http);   
    }

    this.suggest_friends = function(){
        return _deferred_request('/api/v0/get_friends_of_friend', $q, $http);
    }

}]);