//This handles retrieving data and is used by controllers. 3 options (server, factory, provider) with 
//each doing the same thing just structuring the functions/data differently.
recommendationApp.service('recommendationService', function ($http, $q, $rootScope) {
    this.getBooks = function () {
        var deferred = $q.defer();
        $http.get('/api/v0/recommended_books').then(function(result) {
                            return deferred.resolve(result.data); 
                        });
        return deferred.promise;
    };

    this.triggerExpand = function(){
        $rootScope.$emit('triggerExpand')
    }

    this.triggerHover = function(){
        $rootScope.$emit('triggerHover')   
    }

    this.triggerMouseOut = function(){
        $rootScope.$emit('triggerMouseOut')   
    }    

    this.getAuthors = function(){
        return a;
    }

    this.getReaders = function(){
        return a;
    }

    a = []

});