homeApp.controller('notificationController', ["$scope", 'feedService', '$timeout', function($scope, feedService, $timeout){
	var _init = (function(){
		$scope.info.loading = true;

		var notifications_timeout = $timeout(function(){
			feedService.get_notifications().then(function(data){
				$scope.info.loading = false;
				$scope.notifications = data;
			});
		}, 100);
		$scope.$on('destroy', function(){
			$timeout.cancel(notifications_timeout);
		});
	}());

	$scope.stop_propagation = function(event){
		event.stopPropagation();
	}
}]);