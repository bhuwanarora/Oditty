homeApp.controller('homeController', ["$scope", "$rootScope", 'userService', function($scope, $rootScope, userService){

	$scope.goto_community_page = function(id){
		userService.news_visited(id);
		window.location.href = "/community?q="+id;
	}

    var _init = (function(){
    	var _create_empty_feed = (function(){
    		$scope.feed = [];
    		for(var i = 0; i < 10; i++){
    			$scope.feed = $scope.feed.concat([{"communities": []}]);
    		}
    	}());

        userService.get_feed().then(function(data){
        	angular.forEach($scope.feed, function(value, index){
	            value.communities = value.communities.concat(data[index].communities);
	            angular.forEach(value.communities, function(community){
	                community.view_count = 100;
	            });
	            delete data[index].communities;
	            value = angular.extend(value, data[index]);
        	});
        });
    }());

}]);