websiteApp.service('bookWidgetService', function ($http, $q, $rootScope) {
    this.populate_tooltips = function (id) {
        var deferred = $q.defer();
        $http.get('/api/v0/tooltip?id='+id).then(function(result) {
            return deferred.resolve(result.data);
        });
        return deferred.promise;
    };
});