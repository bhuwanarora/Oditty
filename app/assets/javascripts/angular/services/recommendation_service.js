//This handles retrieving data and is used by controllers. 3 options (server, factory, provider) with 
//each doing the same thing just structuring the functions/data differently.
recommendationApp.service('recommendationService', function ($http, $q, $rootScope) {
    this.get_recommendations = function () {
        var deferred = $q.defer();
        filters = angular.toJson($rootScope.filters)
        $http.get('/api/v0/recommendations?count=5&q='+filters).then(function(result) {
                            return deferred.resolve(result.data); 
                        });
        return deferred.promise;
    };

    this.get_filters = function(){
    	var deferred = $q.defer();
        $http.get('/api/v0/filters').then(function(result) {
                            return deferred.resolve(result.data); 
                        });
        return deferred.promise;	
    }

    this.get_genres = function(filter){
        var deferred = $q.defer();
        $http.get('/api/v0/genres?'+filter).then(function(result) {
                            return deferred.resolve(result.data); 
                        });
        return deferred.promise;
    }

    this.get_countries = function(filter){
        var deferred = $q.defer();
        $http.get('/api/v0/countries?'+filter).then(function(result) {
                            return deferred.resolve(result.data); 
                        });
        return deferred.promise;
    }
});