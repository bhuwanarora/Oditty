websiteApp.service('widgetService', ['$http', '$q', '$rootScope', 'WebsiteUIConstants', function ($http, $q, $rootScope, WebsiteUIConstants){
    
    this.get_book_feed = function(id){
        return _deferred_request('/api/v0/book_feed?id='+id);
    }

    this.save_genre = function(params){
        return _deferred_post_request('/api/v0/save_genre', params);
    }

    this.populate_tooltips = function(id){
    	return _deferred_request('/api/v0/tooltip?id='+id);
    }

    this.mark_as_read = function(id, data){
    	return _deferred_post_request('/api/v0/mar', {"book_id":id, "data":data});
    }

    this.recommend = function(params){
    	return _deferred_post_request('/api/v0/recommend', params);
    }

    this.bookmark = function(params){
    	return _deferred_post_request('/api/v0/bookmark', params);
    }

    this.comment = function(params){
    	return _deferred_post_request('/api/v0/comment', params);
    }

    this.what_do_you_feel = function(id, type, data){
    	return _deferred_post_request('/api/v0/wdyf', {"id":id, "type":type, "data":data});
    }

    this.record_time = function(id, data){
    	return _deferred_post_request('/api/v0/time', {"id":id, "data":data});
    }

    this.rate_this_book = function(params){
    	return _deferred_post_request('/api/v0/rate', params);
    }

    this.own_this_book = function(id, data){
    	return _deferred_post_request('/api/v0/own', {"book_id":id, "data":data});
    }

    this.like = function(id, type){
    	return _deferred_post_request('/api/v0/like', {"id":id, "type":type});
    }

    this.dislike = function(id, type){
    	return _deferred_post_request('/api/v0/dislike', {"id":id, "type":type});
    }

    this.post_a_review = function(book_id, data){
    	return _deferred_post_request('/api/v0/post_review', {"book_id":id, "data":data});
    }

    this.follow = function(params){
    	return _deferred_post_request('/api/v0/follow', params);
    }

    this.get_moments = function(){
        return _deferred_request('/api/v0/moments?id='+1);
    }

    this.get_friends = function(id, count, skip){
        return _deferred_request('/api/v0/friends?id='+id+"&count="+count+"&skip="+skip);
    }

    this.get_labels = function(){
        return _deferred_request('/api/v0/labels');   
    }

    this.get_affiliate_links = function(book_id){
        return _deferred_request('/api/v0/affiliate_links?id='+book_id);
    }

    this.add_thumbnail = function(params){
        return _deferred_post_request('/api/v0/add_thumbnail', params);
    }

    this.get_author_details = function(book_id){
        return _deferred_request('/api/v0/author_details?book_id='+book_id);
    }

    _deferred_request = function(url){
        var deferred = $q.defer();
        var success_callback = function(result) {
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

    _deferred_post_request = function(url, params){
        var deferred = $q.defer();
        var success_callback = function(result){
            return deferred.resolve(result.data); 
        }
        var error_callback = function(reason){
            if(reason.status == 500){
                alert(WebsiteUIConstants.ServerError);
            }
        }
        $http.post(url, params).then(success_callback, error_callback);
        return deferred.promise;
    }

}]);