websiteApp.controller('bookTimelineController', ['$scope', '$rootScope', '$timeout', 'widgetService', '$route', '$routeParams', '$interval', function($scope, $rootScope, $timeout, widgetService, $route, $routeParams, $interval){
	_init = function(){
		widgetService.get_moments().then(function(data){
			$scope.moments = data.moments;
		});
	}

	_init();
}]);