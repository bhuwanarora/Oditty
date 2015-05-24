homeApp.controller('homeController', ["$scope", "$rootScope", 'userService', '$mdBottomSheet', 'shelfService', '$timeout', '$location', 'userService', 'bookService', function($scope, $rootScope, userService, $mdBottomSheet, shelfService, $timeout, $location, userService, bookService){

	$scope.goto_news_page = function(id, community_id){
		userService.news_visited(id);
        deleteCookie("active_community");
        if(angular.isDefined(community_id)){
            setCookie("active_community", community_id, 1)
        }
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

    $scope.change_feed = function(){
        $scope.feed = [];
        setCookie("active_region", $scope.info.active_region, 31);
        $scope.get_community_feed();        
    }

    $scope.get_community_feed = function(){
        if(!$scope.info.loading){
            $scope.info.loading = true;
            var region_id = $scope.info.active_region;
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
        var active_region = getCookie("active_region");
        if(angular.isDefined(active_region) && active_region != "" && active_region != null){
            $scope.info.active_region = active_region;
            var timeout_set_region = $timeout(function(){
                $scope.info.active_region = active_region;
            }, 2000);
        }

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
        $scope.info.loading = false;
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