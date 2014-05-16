websiteApp.service('widgetService', function ($http, $q, $rootScope) {
    this.populate_tooltips = function(id){
    	return _deferred_request('/api/v0/tooltip?id='+id);
    };

    this.mark_as_read = function(id, data){
    	return _deferred_post_request('/api/v0/mar', {"book_id":id, "data":data});
    }

    this.recommend = function(type, id, data){
    	return _deferred_post_request('/api/v0/recommend', {"id":id, "type":type, "data":data});
    }

    this.bookmark = function(type, id, data){
    	return _deferred_post_request('/api/v0/bookmark', {"id":id, "type":type, "data":data});
    }

    this.comment = function(id, type, data){
    	return _deferred_post_request('/api/v0/comment', {"id":id, "type":type, "data":data});
    }

    this.what_do_you_feel = function(id, type, data){
    	return _deferred_post_request('/api/v0/wdyf', {"id":id, "type":type, "data":data});
    }

    this.record_time = function(id, data){
    	return _deferred_post_request('/api/v0/time', {"id":id, "data":data});
    }

    this.rate_this_book = function(id, data){
    	return _deferred_post_request('/api/v0/rate', {"id":id, "data":data});
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

    this.follow = function(id, type, data){
    	return _deferred_post_request('/api/v0/follow', {"id":id, "type":type, "data":data});
    }

    this.get_moments = function(){
        return _deferred_request('/api/v0/moments?id='+1);
    }

    this.get_friends = function(id){
        return _deferred_request('/api/v0/friends?id='+id);
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