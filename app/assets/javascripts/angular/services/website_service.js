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
    	$http.post('/api/v0/authenticate', data).then(function(result){
            return deferred.resolve(result.data); 
        });
        return deferred.promise;	
    }

    this.update_profile = function(data){
        var deferred = $q.defer();
        $http.post('/api/v0/profile', data).then(function(result){
            return deferred.resolve(result.data); 
        });
        return deferred.promise;   
    }

    
    this.get_user_details = function(filter){
        //filter user_id=USER_ID
        var deferred = $q.defer();
        $http.get('/api/v0/user_details?'+filter).then(function(result) {
            return deferred.resolve(result.data); 
        });
        return deferred.promise;
    }

    this.get_background_image = function(){
        var deferred = $q.defer();
        $http.get('/api/v0/image').then(function(result) {
            return deferred.resolve(result.data); 
        });
        return deferred.promise;
    }

    this.get_notifications = function(data){
        var deferred = $q.defer();
        $http.get('/api/v0/notifications?id='+data.id).then(function(result) {
            return deferred.resolve(result.data); 
        });
        return deferred.promise;   
    }

    this.search = function(filter, type){
        var deferred = $q.defer();
        $http.get('/api/v0/search?count=3&q='+filter+'&t='+type).then(function(result){
            return deferred.resolve(result.data);
        });
        return deferred.promise;
    }

});