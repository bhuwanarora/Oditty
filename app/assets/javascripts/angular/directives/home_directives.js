homeApp.directive('suggestCommunities', ["$rootScope", "userService", function($rootScope, userService){
    return {
        restrict: 'E',
        controller: ["$scope", function($scope){
            var _init = function(){
                userService.suggest_communities().then(function(data){
                    $scope.suggest_communities = data;
                });
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/home/partials/community_suggestions.html'
    };
}]);

homeApp.directive('joinCommunity', ["$rootScope", "newsService", function($rootScope, newsService){
    return {
        restrict: 'E',
        scope: {community: '='},
        controller: ["$scope", function($scope){
            $scope.toggle = function(){
                var id = $scope.community.id;
                $scope.community.status = !$scope.community.status;
                newsService.follow(id, $scope.community.status);
            }

        }],
        templateUrl: '/assets/angular/html/home/partials/community.html'
    };
}]);