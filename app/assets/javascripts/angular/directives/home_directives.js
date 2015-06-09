homeApp.directive('suggestCommunities', ["$rootScope", "userService", "$timeout", function($rootScope, userService, $timeout){
    return {
        restrict: 'E',
        controller: ["$scope", function($scope){
            var _init = function(){
                $scope.info.loading = true;
                var room_timeout = $timeout(function(){
                    userService.suggest_communities().then(function(data){
                        $scope.info.loading = false;
                        $scope.suggest_communities = data;
                    });
                }, 100);
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