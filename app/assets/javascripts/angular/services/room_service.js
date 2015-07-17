homeApp.service('roomService', ["$http", "$q", "$rootScope", "WebsiteUIConstants", function($http, $q, $rootScope, WebsiteUIConstants){

	this.get_books_grouped_by_shelves = function(){
		return _deferred_request('/api/v0/book_shelves', $q, $http);
	}

	this.get_articles_grouped_by_shelves = function(){
		return _deferred_request('/api/v0/article_shelves', $q, $http);
	}

	this.get_visited_articles = function(){
		return _deferred_request('/api/v0/visited_articles', $q, $http);
	}

	this.get_visited_books = function(){
		return _deferred_request('/api/v0/visited_books', $q, $http);
	}
}]);