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

    $scope.get_community_feed = function(){
        $scope.info.loading = true;
        userService.get_feed().then(function(data){
            $scope.info.loading = false;
            angular.forEach(data, function(value){
                var json = {'label': 'news'};
                value = angular.extend(value, json);
                this.push(value);
            }, $scope.feed);
        });
    }

    var _init = (function(){
    	$scope.feed = [];

        var _get_blog_feed = function(){
            userService.get_last_blog().then(function(data){
                data[0].label = 'blog';
                $scope.feed.push(data[0]);
            });
        }

        var url = $location.absUrl();

        
        $scope.$on('destroy', function(){
            $timeout.cancel(timeout_event);
        });

        var communities = (url.indexOf("communities") > 0);
        var blogs = (url.indexOf("blogs") > 0);
        if(communities){
            $scope.get_community_feed();
        }
        else if(blogs){
            _get_blog_feed();
        }
        else{
            $scope.get_community_feed();
            var timeout_event = $timeout(function(){
                _get_blog_feed();
            }, 6000);
            $scope.$on('destroy', function(){
                $timeout.cancel(timeout_event);
            });
        }

    }());
}]);