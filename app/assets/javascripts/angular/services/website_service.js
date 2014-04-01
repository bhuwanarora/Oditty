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

    this.authenticate = function(data){
    	var deferred = $q.defer();
    	$http.post('http://bhuwan.com:3000/api/v0/authenticate', data).then(function(result){
            return deferred.resolve(result.data); 
        });
        return deferred.promise;	
    }

    this.update_profile = function(data){
        var deferred = $q.defer();
        $http.post('http://bhuwan.com:3000/api/v0/profile', data).then(function(result){
            return deferred.resolve(result.data); 
        });
        return deferred.promise;   
    }

});