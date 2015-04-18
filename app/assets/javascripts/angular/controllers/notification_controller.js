homeApp.controller('notificationController', ["$scope", 'feedService', function($scope, feedService){
	var _init = (function(){
		feedService.get_notifications().then(function(data){
			$scope.notifications = data;
		});
	}());

	$scope.stop_propagation = function(event){
		event.stopPropagation();
	}
}]);