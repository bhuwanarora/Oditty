homeApp.service('shelfService', ["$http", "$q", "$rootScope", "WebsiteUIConstants", function($http, $q, $rootScope, WebsiteUIConstants){

	this.get_all_shelves = function(){
		return _deferred_request('/api/v0/labels', $q, $http);
	};

	this.add_new_label = function(label, type){
		return _deferred_request('/api/v0/add_new_label?label='+label+'&type='+type, $q, $http);
	};

    this.bookmark = function(params){
        return _deferred_post_request('/api/v0/bookmark', params, $q, $http);
    }

}]);