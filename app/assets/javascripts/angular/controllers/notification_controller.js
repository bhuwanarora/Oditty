homeApp.controller('notificationController', ["$scope", 'feedService', '$timeout', function($scope, feedService, $timeout){
	var _init = (function(){

		
	}());

	$scope.stop_propagation = function(event){
		event.stopPropagation();
	}
}]);