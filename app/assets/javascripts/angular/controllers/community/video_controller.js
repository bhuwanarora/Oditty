homeApp.controller('videoController', ["$scope", "$rootScope", "$timeout", 'websiteService', function($scope, $rootScope, $timeout, websiteService){

	var _init = (function(){
		if(angular.isDefined($scope.active_tag) && angular.isDefined($scope.active_tag.id)){
			var id = $scope.active_tag.id;
			websiteService.get_community_videos(id).then(function(data){
				$scope.videos = data;
			});
		}
		else{
			$location.path("/room/books");
		}
	}());
}]);