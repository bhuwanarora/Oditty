homeApp.controller('videoController', ["$scope", "$rootScope", "$timeout", 'websiteService', '$sce', function($scope, $rootScope, $timeout, websiteService, $sce){

	var _init = (function(){
		if(angular.isDefined($scope.active_tag) && angular.isDefined($scope.active_tag.id)){
			var id = $scope.active_tag.id;
			websiteService.get_community_videos(id).then(function(data){
				$scope.videos = [];
				angular.forEach(data, function(value){
					value.url = value.url.replace("watch?v=", "v/").replace("https", "http").replace("http", "https");
					value.url = $sce.trustAsResourceUrl(value.url+"?output=embed");
					this.push(value);
				}, $scope.videos);
			});
		}
		else{
			$location.path("/room/books");
		}
	}());
}]);