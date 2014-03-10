//This handles retrieving data and is used by controllers. 3 options (server, factory, provider) with 
//each doing the same thing just structuring the functions/data differently.
recommendationApp.service('recommendationService', function ($http, $q, $rootScope) {
    this.getRecommendations = function () {
        var deferred = $q.defer();
        filters = angular.toJson($rootScope.filters)
        $http.get('/api/v0/recommendations?count=5&q='+filters).then(function(result) {
                            return deferred.resolve(result.data); 
                        });
        return deferred.promise;
    };
});