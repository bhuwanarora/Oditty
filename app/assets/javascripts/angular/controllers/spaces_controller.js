homeApp.controller('spacesController', ["$rootScope", "userService", "$timeout", "$mdSidenav", function($rootScope, userService, $timeout, $mdSidenav){
    $scope.get_feed = function(){
        if(!$scope.info.feed_loading){
            $scope.info.feed_loading = true;
            if(angular.isDefined($scope.social_feed)){
                var skip = $scope.social_feed.length;
            }
            else{
                var skip = 0;
                $scope.social_feed = [];
            }
            if(angular.isDefined($scope.global) && $scope.global){
                userService.get_global_feed(skip).then(function(data){
                    $scope.info.feed_loading = false;
                    $scope.social_feed = $scope.social_feed.concat(data);
                });
            }
            else{
                userService.get_social_feed(skip).then(function(data){
                    $scope.info.feed_loading = false;
                    $scope.social_feed = $scope.social_feed.concat(data);
                });
            }
        }
    }

    var _unauthenticated_user = function(){
        return ((getCookie("logged") == "") || (getCookie("logged") == null));
    }

    $scope.handle_feed = function(){
        if(_unauthenticated_user()){
            $mdSidenav('signup').toggle();
        }
        else{
            $scope.get_feed();
        }
    }

    var _init = (function(){
        var room_timeout = $timeout(function(){
            $scope.handle_feed();
        }, 100);

        $scope.$on('destroy', function(){
            $timeout.cancel(room_timeout);
        });
    }());
    
}]);