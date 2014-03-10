//This handles retrieving data and is used by controllers. 3 options (server, factory, provider) with 
//each doing the same thing just structuring the functions/data differently.
websiteApp.service('websiteService', function ($http, $q, $rootScope) {
    this.getFilters = function(){
    	var deferred = $q.defer();
        $http.get('/api/v0/filters').then(function(result) {
                            return deferred.resolve(result.data); 
                        });
        return deferred.promise;	
    }

});