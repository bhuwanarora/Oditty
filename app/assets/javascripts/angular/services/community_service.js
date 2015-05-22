homeApp.service('communityService', ["$http", "$q", "$rootScope", "WebsiteUIConstants", function($http, $q, $rootScope, WebsiteUIConstants){

	this.get_news_info = function(id, tag_id){
        if(angular.isDefined(tag_id) && (tag_id != "")){
            return _deferred_request('/api/v0/news_info?id='+id+'&tag_id='+tag_id, $q, $http);
        }
        else{
		    return _deferred_request('/api/v0/news_info?id='+id, $q, $http);
        }
	}

    this.get_chronological_news = function(id){
        return _deferred_request('/api/v0/chronological_news?id='+id, $q, $http);
    }

    this.get_community_details = function(id){
        return _deferred_request('/api/v0/basic_community_info?id='+id, $q, $http);
    }

    this.get_metadata = function(url){
        return _deferred_request('/api/v0/metadata?url='+url, $q, $http);
    }

    this.get_detailed_community_info = function(id){
        return _deferred_request('/api/v0/detailed_community_info?id='+id, $q, $http);
    }

    this.follow = function(id, status){
        return _deferred_request('/api/v0/follow_community?id='+id+"&status="+status, $q, $http);
    }

    this.get_feed_info = function(id){
        return _deferred_request('/api/v0/feed_community_info?id='+id, $q, $http);
    }
}]);