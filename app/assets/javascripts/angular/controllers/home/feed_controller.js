homeApp.controller('feedController', ["$scope", "$rootScope", 'userService', '$mdBottomSheet', 'shelfService', '$timeout', '$location', 'userService', 'bookService', function($scope, $rootScope, userService, $mdBottomSheet, shelfService, $timeout, $location, userService, bookService){

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

    var _shuffle_array = function(array) {
        var m = array.length, t, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        return array;
    }

    $scope.get_community_feed = function(){
        if(!$scope.info.loading){
            $scope.info.loading = true;
            var region_id = $scope.info.active_region;
            if(angular.isUndefined($scope.feed)){
                $scope.feed = []; 
            }
            var skip = $scope.feed.length;
            userService.get_feed(skip).then(function(data){
                $scope.info.loading = false;
                $scope.feed = $scope.feed.concat(_shuffle_array(data));
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
        }

    }());
}]);