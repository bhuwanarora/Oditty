homeApp.directive('newsScroller', ["$rootScope", "newsService", function($rootScope, newsService){
    return {
        restrict: 'E',
        controller: ["$scope", function($scope){
            var _init = function(){
                var news_id = $scope.info.active_news_id;
                // $scope.news = [];
                newsService.get_chronological_news(news_id).then(function(data){
                    $scope.news = data;
                    angular.forEach($scope.news, function(value, index){
                        if(parseInt($scope.info.active_news_id) == value.id){
                            $scope.selectedIndex = index;
                            $scope.info.active_news = value;
                        }
                    });
                });
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/news/_footer.html'
    };
}]);

homeApp.directive('visitNews', ["newsService", function(newsService){
    return{
        restrict: 'E',
        scope: {newsId: '='},
        controller: ["$scope", function($scope){
            var _init = (function(){
                newsService.news_visited($scope.newsId);
            }());
        }]
    }
}]);