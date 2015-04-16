homeApp.controller('searchController', ["$scope", "searchService", function($scope, searchService){

    $scope.show_search_bar = function() {
        $scope.visible_search_bar = !$scope.visible_search_bar;
    
    };

    $scope.query_search = function(search_text){
        searchService.raw(search_text).then(function(data){
            $scope.search_results = data;
            $scope.did_you_mean = false;
            angular.forEach(data, function(value){
                if(value.fuzzy){
                    $scope.did_you_mean = true;
                }
                console.debug(value);
            });
            if($scope.did_you_mean){
                var json = {"name": "Did you mean"};
                $scope.search_results.splice(0, 0, json);
            }
        });
    }

    var _init = (function(){
        $scope.search_results = [];
    }());
}]);