homeApp.controller('recommendController', ["$scope", 'networkService', '$timeout', function($scope, networkService, $timeout){
	$scope.toggle_recommend = function(){
		$scope.show_recommend = !$scope.show_recommend;
        if(angular.isUndefined($scope.users_list)){
        	$scope.info.share_loading = true;
            networkService.get_followers().then(function(data){
                $scope.users_list = data;
                $scope.info.share_loading = false;
            });
        }
    }

    $scope.search_friends = function(q){
        networkService.search_friends(q).then(function(data){
            $scope.users_list = data;
        });
    }

    var _init = (function(){
        var friends_timeout = $timeout(function(){
            $scope.toggle_recommend();
        }, 100);
        $scope.$on('destroy', function(){
            $timeout.cancel(friends_timeout);
        });
    }());
}]);