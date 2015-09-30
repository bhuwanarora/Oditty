homeApp.directive('timeTravel', ["websiteService", "$timeout", "$location", "CompressedYears", "sharedService", function(websiteService, $timeout, $location, CompressedYears, sharedService){
    return {
        restrict: 'E',
        scope: {"info": "=", 'activeTag': "="},
        controller: ["$scope", "$stateParams", function($scope, $stateParams){
            $scope.show_all_times = function(){
                $scope.show_all = !$scope.show_all;
            }

            var _handle_year = function(){
                var year = $stateParams.year;
                $scope.info.active_year = year;                
                if(angular.isUndefined(year)){
                    $stateParams.year = "recent";
                    $scope.info.active_year = "recent";
                    year = "recent";
                }
                if(year == "recent" || year == 2014 || year == 2013 || year == 1998){
                    $scope.show_all = false;
                }
                else{
                    $scope.show_all = true;
                }
            }

            var _handle_month = function(){
                var year = $scope.info.active_year;
                var month = $stateParams.month;
                if(angular.isUndefined(month)){
                    if(year == "recent"){
                        $scope.info.active_month = "Sept";
                    }
                    else{
                        $scope.info.active_month = "Dec";   
                    }
                    month = $scope.info.active_month;
                    $stateParams.month = $scope.info.active_month;
                }
                else{
                    $scope.info.active_month = month;
                }
            }

            var _handle_news = function(){
                $scope.active_tag = $scope.activeTag;
                if(angular.isDefined($scope.active_tag)){
                    delete $scope.active_tag.news;
                }
                sharedService.get_community_news($scope);
            }

            var _init = function(){
                $scope.$stateParams = $stateParams;
                _handle_year();
                _handle_month();
                _handle_news();
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
        scope: {"info": "=", "year": "=", 'activeTag': "="},
        controller: ["$scope", "$stateParams", function($scope, $stateParams){

            $scope.get_community_news = function(year, month){
                $scope.info.active_year = year;
                if(year == 'Recent'){
                    month = 'Sept';
                }
                $scope.info.active_month = month;
                if(angular.isDefined($scope.active_tag)){
                    delete $scope.active_tag.news;
                }
                sharedService.get_community_news($scope);
            }

            var _handle_year = function(){
                var year = $stateParams.year;
                $scope.info.active_year = year;                
                if(angular.isUndefined(year)){
                    $stateParams.year = "recent";
                    $scope.info.active_year = "recent";
                    year = "recent";
                }
                if(year == "recent" || year == 2014 || year == 2013 || year == 1998){
                    $scope.show_all = false;
                }
                else{
                    $scope.show_all = true;
                }
            }

            var _handle_month = function(){
                var year = $scope.info.active_year;
                var month = $stateParams.month;
                if(angular.isUndefined(month)){
                    if(year == "recent"){
                        $scope.info.active_month = "Sept";
                    }
                    else{
                        $scope.info.active_month = "Dec";   
                    }
                    month = $scope.info.active_month;
                    $stateParams.month = $scope.info.active_month;
                }
                else{
                    $scope.info.active_month = month;
                }
            }

            var _init = function(){
                $scope.$stateParams = $stateParams;
                $scope.active_tag = $scope.activeTag;
                $scope.months = Months;
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/shared/months.html'
    };
}]);