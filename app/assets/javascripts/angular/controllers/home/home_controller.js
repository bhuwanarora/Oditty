homeApp.controller('homeController', ["$scope", "$rootScope", 'userService', '$mdBottomSheet', 'shelfService', '$timeout', '$location', function($scope, $rootScope, userService, $mdBottomSheet, shelfService, $timeout, $location){

	$scope.goto_community_page = function(id){
		userService.news_visited(id);
		window.location.href = "/community?q="+id;
	}

    $scope.show_shelf_bottom_sheet = function(bookmark_object_id, bookmark_object_type){
        $rootScope.bookmark_object = {"type": bookmark_object_type, "id": bookmark_object_id};
        $mdBottomSheet.show({
            templateUrl: 'assets/angular/html/shared/shelf_bottom_sheet.html',
            controller: 'shelfController',
            targetEvent: event
        });
        event.stopPropagation();
    };

    var _init = (function(){
    	var _create_empty_feed = (function(){
    		$scope.feed = [];
    		for(var i = 0; i < 10; i++){
    			$scope.feed = $scope.feed.concat([{"communities": []}]);
    		}
    	}());

        var _get_community_feed = function(){
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
        }

        var _get_blog_feed = function(){
            userService.get_blog_feed().then(function(data){
                $scope.feed = data.concat($scope.feed);
            });
        }

        var url = $location.absUrl();

        
        $scope.$on('destroy', function(){
            $timeout.cancel(timeout_event);
        });

        var communities = (url.indexOf("communities") > 0);
        var blogs = (url.indexOf("blogs") > 0);
        if(communities){
            _get_community_feed();
        }
        else if(blogs){
            _get_blog_feed();
        }
        else{
            _get_community_feed();
            var timeout_event = $timeout(function(){
                _get_blog_feed();
            }, 1000);
        }

        

    }());
}]);