homeApp.directive('newsScroller', ["$rootScope", "communityService", function($rootScope, communityService){
    return {
        restrict: 'E',
        controller: ["$scope", function($scope){
            var _init = function(){
                var news_id = $scope.info.active_news_id;
                communityService.get_chronological_news(news_id).then(function(data){
                    $scope.news = data;
                    angular.forEach($scope.news, function(value, index){
                        if(parseInt($scope.info.active_news_id) == value.id){
                            $scope.selectedIndex = index;
                            $rootScope.active_news = value;
                        }
                    });
                });
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/community/_footer.html'
    };
}]);