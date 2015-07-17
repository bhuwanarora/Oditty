

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
                    // delete $scope.community;
                }
            }

        }],
        templateUrl: '/assets/angular/html/home/partials/community.html'
    };
}]);