homeApp.controller('recommendController', ["$scope", "userService", '$rootScope', "WebsiteUIConstants", 'ColorConstants', 'networkService', function($scope, userService, $rootScope, WebsiteUIConstants, ColorConstants, networkService){
	$scope.toggle_recommend = function(){
		$scope.show_recommend = !$scope.show_recommend;
        if(angular.isUndefined($scope.users_list)){
            networkService.get_followers().then(function(data){
                $scope.users_list = data;
            });
        }
    }
}]);