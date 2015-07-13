homeApp.controller('recommendController', ["$scope", 'networkService', '$timeout', '$mdSidenav', function($scope, networkService, $timeout, $mdSidenav){
	$scope.toggle_recommend = function(){
		$scope.show_recommend = !$scope.show_recommend;
        if(angular.isUndefined($scope.users_list)){
            $scope.search_friends("");
        }
    }

    $scope.search_friends = function(q){
        $scope.info.share_loading = true;
        networkService.search_friends(q).then(function(data){
            $scope.users_list = data;
            $scope.info.share_loading = false;
        });
    }

    var _unauthenticated_user = function(){
        return ((getCookie("logged") == "") || (getCookie("logged") == null));
    }

    $scope.show_signin = function(){
        $mdSidenav('signup').toggle();
    }

    var _init = (function(){
        if(_unauthenticated_user()){
            $scope.sign_in = true;
        }
        else{
            var friends_timeout = $timeout(function(){
                $scope.toggle_recommend();
            }, 100);
            $scope.$on('destroy', function(){
                $timeout.cancel(friends_timeout);
            });
        }
    }());
}]);