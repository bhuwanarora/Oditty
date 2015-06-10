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
                        $scope.show_suggestions = true;
                    });
                }, 100);
            }

            $scope.toggle_suggestions = function(){
                $scope.show_suggestions = !$scope.show_suggestions;
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/home/partials/community_suggestions.html'
    };
}]);

homeApp.directive('joinCommunity', ["$rootScope", "newsService", "$mdSidenav", function($rootScope, newsService, $mdSidenav){
    return {
        restrict: 'E',
        scope: {community: '='},
        controller: ["$scope", function($scope){
            var _unauthenticated_user = function(){
                return ((getCookie("logged") == "") || (getCookie("logged") == null));
            }

            $scope.toggle = function(){
                if(_unauthenticated_user()){
                    $mdSidenav('signup').toggle();
                }
                else{
                    var id = $scope.community.id;
                    $scope.community.status = !$scope.community.status;
                    newsService.follow(id, $scope.community.status);
                }
            }

        }],
        templateUrl: '/assets/angular/html/home/partials/community.html'
    };
}]);