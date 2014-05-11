//This handles retrieving data and is used by controllers. 3 options (server, factory, provider) with 
//each doing the same thing just structuring the functions/data differently.
websiteApp.service('recommendationService', function ($http, $q, $rootScope) {
    this.get_recommendations = function () {
        var filters = angular.toJson($rootScope.filters);
        return _deferred_request('/api/v0/recommendations?count=5&q='+filters);
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

    _deferred_request = function(url){
        var deferred = $q.defer();
        $http.get(url).then(function(result) {
            return deferred.resolve(result.data); 
        });
        return deferred.promise;   
    }
});