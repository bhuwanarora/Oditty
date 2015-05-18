homeApp.controller('homeController', ["$scope", "$rootScope", 'userService', '$mdBottomSheet', 'shelfService', '$timeout', '$location', 'userService', 'bookService', function($scope, $rootScope, userService, $mdBottomSheet, shelfService, $timeout, $location, userService, bookService){

	$scope.goto_community_page = function(id){
		userService.news_visited(id);
		window.location.href = "/news?q="+id;
	}

    $scope.search_books = function(q){
        $scope.info.loading = true;
        bookService.search_books(q, 10).then(function(data){
            $scope.info.loading = false;
            $scope.did_you_mean = true;
            angular.forEach(data, function(value){
                if(angular.isUndefined(value.fuzzy)){
                    this.push(value);
                }
            }, $scope.search_results)
        });
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

    $scope.change_feed = function(){
        $scope.feed = [];
        $scope.get_community_feed();        
    }

    $scope.get_community_feed = function(){
        if(!$scope.info.loading){
            $scope.info.loading = true;
            var region_id = $scope.active_region;
            userService.get_feed(region_id).then(function(data){
                $scope.info.loading = false;
                angular.forEach(data, function(value){
                    var json = {'label': 'news'};
                    value = angular.extend(value, json);
                    this.push(value);
                }, $scope.feed);
            });
        }
    }

    $scope.get_blog_feed = function(){
        if(!$scope.info.loading){
            $scope.info.loading = true;
            if(angular.isUndefined($scope.feed)){
                $scope.feed = [];
            }
            var skip = $scope.feed.length;
            var multiple = true;
            userService.get_blog_feed(skip, multiple).then(function(data){
                angular.forEach(data, function(value){
                    value.label = "blog";
                    this.push(value);
                }, $scope.feed);
                $scope.info.loading = false;
            });
        }
    }


    var _init = (function(){
    	$scope.feed = [];
        // $scope.info.hide_feed = true;

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

        userService.get_regions().then(function(data){
            $scope.regions = data[0].regions;
        });

        var communities = (url.indexOf("communities") > 0);
        var blogs = (url.indexOf("blogs") > 0);
        if(communities){
            $scope.get_community_feed();
        }
        else if(blogs){
            $scope.get_blog_feed();
        }
        else{
            $scope.get_community_feed();
            // var timeout_event = $timeout(function(){
            //     _get_blog_feed();
            // }, 6000);
            // $scope.$on('destroy', function(){
            //     $timeout.cancel(timeout_event);
            // });
        }

    }());
}]);