//This handles retrieving data and is used by controllers. 3 options (server, factory, provider) with 
//each doing the same thing just structuring the functions/data differently.
recommendationApp.service('recommendationService', function ($http, $q) {
    this.getBooks = function () {
        var deferred = $q.defer();
        $http.get('/api/v0/recommended_books?count=5').then(function(result) {
                            return deferred.resolve(result.data); 
                        });
        return deferred.promise;
    };

    this.getAuthors = function(){
        return a;
    }

    this.getReaders = function(){
        return a;
    }

    a = []

});