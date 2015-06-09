homeApp.controller('recommendController', ["$scope", "userService", '$rootScope', "WebsiteUIConstants", 'ColorConstants', 'networkService', function($scope, userService, $rootScope, WebsiteUIConstants, ColorConstants, networkService){
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
}]);