//This handles retrieving data and is used by controllers. 3 options (server, factory, provider) with 
//each doing the same thing just structuring the functions/data differently.
websiteApp.service('websiteService', function ($http, $q, $rootScope) {
	
    this.get_book_details = function(filter){
        var deferred = $q.defer();
        $http.get('/api/v0/book?'+filter).then(function(result) {
            return deferred.resolve(result.data); 
        });
        return deferred.promise;
    }    

});