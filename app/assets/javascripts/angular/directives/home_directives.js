homeApp.directive('suggestCommunities', ["$rootScope", "userService", function($rootScope, userService){
    return {
        restrict: 'E',
        controller: ["$scope", function($scope){
            var _init = function(){
                userService.suggest_communities().then(function(data){
                    $scope.suggest_communities = data;
                });
            }

            // $scope.toggle_follow = function(){
            //     $scope.active_tag.status = !$scope.active_tag.status;
            //     communityService.follow($scope.active_tag.id, $scope.active_tag.status);
            // }

            _init();
        }],
        templateUrl: '/assets/angular/html/home/partials/community_suggestions.html'
    };
}]);

homeApp.directive('community', ["$rootScope", "communityService", function($rootScope, communityService){
    return {
        restrict: 'E',
        scope: {community: '='},
        controller: ["$scope", function($scope){
            $scope.toggle = function(){
                var id = $scope.community.id;
                $scope.community.status = !$scope.community.status;
                communityService.follow(id, $scope.community.status);
            }

        }],
        templateUrl: '/assets/angular/html/home/partials/community_suggestions.html'
    };
}]);