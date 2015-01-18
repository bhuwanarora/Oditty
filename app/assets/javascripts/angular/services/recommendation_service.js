//This handles retrieving data and is used by controllers. 3 options (server, factory, provider) with 
//each doing the same thing just structuring the functions/data differently.
websiteApp.service('recommendationService', ["$http", "$q", "$rootScope", "WebsiteUIConstants", function($http, $q, $rootScope, WebsiteUIConstants){

    var _deferred_request = function(url){
        var deferred = $q.defer();
        var successCallback = function(result) {
            return deferred.resolve(result.data); 
        }
        var errorCallback = function(reason){
            $rootScope.user.loading = false;
            if(reason.status == 500){
                alert(WebsiteUIConstants.ServerError);
            }
        }

        $http.get(url).then(successCallback, errorCallback);
        return deferred.promise;
    }

    this.get_recommendations = function(){
        var filters = angular.toJson($rootScope.filters);
        console.debug("get_recommendations", filters);
        return _deferred_request('/api/v0/recommendations?count=5&id='+$rootScope.user.id+'&q='+filters);
    }

    this.get_random_books = function(){
        return _deferred_request('/api/v0/random_books');
    }

    this.get_grid_books = function(){
        return _deferred_request('/api/v0/grid');
    }

    this.get_book_lists = function(){
        return _deferred_request('/api/v0/book_lists');   
    }

    this.push_recommendations = function(){
        return _deferred_request('/api/v0/push_recommendations');   
    }

    this.get_filters = function(){
        return _deferred_request('/api/v0/filters');
    }

    this.get_genres = function(filter){
        return _deferred_request('/api/v0/genres?'+filter);
    }

    this.get_countries = function(filter){
        return _deferred_request('/api/v0/countries?'+filter);
    }

    this.get_time_groups = function(){
        return _deferred_request('/api/v0/times');
    }

    this.get_read_times = function(){
        return _deferred_request('/api/v0/read_times');   
    }

    this.get_labels = function(id){
        if(angular.isDefined(id)){
            return _deferred_request('/api/v0/labels?id='+id);
        }
        else{
            return _deferred_request('/api/v0/labels');
        }
    }

    
}]);