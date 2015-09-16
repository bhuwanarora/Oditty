homeApp.directive('timeTravel', ["websiteService", "$timeout", "$location", "CompressedYears", "sharedService", function(websiteService, $timeout, $location, CompressedYears, sharedService){
    return {
        restrict: 'E',
        scope: {"info": "=", 'activeTag': "="},
        controller: ["$scope", function($scope){
            $scope.show_all_times = function(){
                $scope.show_all = !$scope.show_all;
            }

            $scope.get_active_class = function(path){
                var route = $location.path().substr(1, path.length+1).replace("/", "");
                var is_init = (route == "") && (path == "recent");
                if((route.indexOf(path) >= 0)|| is_init){
                    return "active_time";
                }
                else{
                    if(route.indexOf("room") >= 0 && (path == "recent")){
                        return "active_time";       
                    }
                }
            }

            var _init = function(){
                $scope.active_tag = $scope.activeTag;
                var time = $location.path().substr(1, 5).replace("/", "");
                var recent = $location.path().substr(1, 7);
                var month = $location.path().split("/")[2];
                if(angular.isDefined($scope.active_tag)){
                    delete $scope.active_tag.news;
                }
                if(recent.indexOf("recent") >= 0 || (time == "") || (time == "room")){
                    $scope.show_all = false;
                    $scope.info.active_time = "recent";
                }
                else{
                    if((time.indexOf("2014") >= 0) || (time.indexOf("2013") >= 0) || (time.indexOf("1998") >= 0)){
                        $scope.show_all = false;
                    }
                    else{
                        $scope.show_all = true;   
                    }
                    $scope.info.active_time = time.replace("/", "");
                }
                if(angular.isUndefined(month)){
                    if($scope.info.active_time == "recent"){
                        $scope.info.active_month = "Sept";
                    }
                    else{
                        $scope.info.active_month = "Dec";   
                    }
                }
                else{
                    $scope.info.active_month = month;
                }
                sharedService.get_community_news($scope);
                // $scope.get_community_news($scope.info.active_time);
                $scope.years = CompressedYears;
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/shared/time_travel.html'
    };
}]);

homeApp.directive('months', ["websiteService", "$timeout", "$location", "Months", "sharedService", function(websiteService, $timeout, $location, Months, sharedService){
    return {
        restrict: 'E',
        scope: {"info": "="},
        controller: ["$scope", function($scope){
            $scope.get_active_class = function(path){
                path = $scope.info.active_time + "/" + path;
                var route = $location.path().substr(1, path.length+1);
                var is_init = (route == "") && (path == "recent");
                if((route.indexOf(path) >= 0)|| is_init){
                    return "active_time";
                }
                else{
                    if((path.indexOf(route) >= 0)){
                        if(path.indexOf("recent") >= 0){
                            if(path.indexOf("Sept") >= 0){
                                return "active_time";
                            }
                        }
                        else{
                            if(path.indexOf("Dec") >= 0){
                                return "active_time";
                            }
                        }
                    }
                }
            }

            var _init = function(){
                $scope.months = Months;
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/shared/months.html'
    };
}]);