homeApp.controller('networkController', ["$scope", "$rootScope", 'networkService', '$location', function($scope, $rootScope, networkService, $location){
	$scope.get_followers = function(){
		$scope.users_list = [];
		$scope.selectedIndex=0;
		networkService.get_followers().then(function(data){
			$scope.users_list = data;
		});
	}
    $scope.get_users_followed = function(){
		$scope.users_list = [];
		$scope.selectedIndex=1;
		networkService.get_users_followed().then(function(data){
			$scope.users_list = data;
		});	
	}
    var _init = (function(){
	    var regex = /[?&]([^=#]+)=([^&#]*)/g;
		var url_parser = regex.exec($location.absUrl());
		if(angular.isDefined(url_parser) && url_parser != null){
			var follow_state = url_parser[2];
			if(follow_state == 0){
               $scope.get_followers();
			}
			else if(follow_state == 1){
               $scope.get_users_followed();
            }
		}
	}());
}]);

