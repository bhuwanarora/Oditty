homeApp.controller('networkController', ["$scope", "$rootScope", 'networkService', function($scope, $rootScope, networkService){
	$scope.get_followers = function(){
		networkService.get_followers().then(function(data){
			$scope.users_list = data;
		});
	}

	$scope.get_users_followed = function(){
		networkService.get_users_followed().then(function(data){
			$scope.users_list = data;
		});	
	}

	var _init = (function(){

	}());
}]);